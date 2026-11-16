import json
import urllib.error
import urllib.request

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

default_code = '''
import java.io.*;
import java.util.*;

public class Code {
    private static InputReader in;
    private static PrintWriter out;

    public static void main(String[] args) {
        in = new InputReader(System.in);
        out = new PrintWriter(System.out);

        // Put your code here!
        //in.next();
        out.println("Hello, World!");

        out.close();
    }

    static class InputReader {
        private final BufferedReader reader;
        private StringTokenizer tokenizer;

        InputReader(InputStream stream) {
            reader = new BufferedReader(new InputStreamReader(stream), 32768);
        }

        String next() {
            while (tokenizer == null || !tokenizer.hasMoreTokens()) {
                try {
                    tokenizer = new StringTokenizer(reader.readLine());
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            return tokenizer.nextToken();
        }

        int nextInt() {
            return Integer.parseInt(next());
        }
    }
}
'''


def piston_request(path, payload=None):
    url = f"{settings.PISTON_API_URL}{path}"
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="GET" if payload is None else "POST",
    )
    with urllib.request.urlopen(request, timeout=settings.PISTON_TIMEOUT) as response:
        return json.loads(response.read().decode("utf-8"))


@ensure_csrf_cookie
@require_http_methods(["GET"])
def index(request):
    runtimes = []
    runtime_error = ""
    try:
        runtimes = piston_request("/api/v2/runtimes")
    except Exception as exc:
        runtime_error = f"Couldn't load Piston runtimes: {exc}"

    return render(request, "runner/index.html", {
        "runtimes": runtimes,
        "runtime_error": runtime_error,
        "default_code": default_code,
    })


@require_http_methods(["POST"])
def run_code(request):
    """Execute one test case and always return a JSON response."""
    try:
        try:
            data = json.loads(request.body.decode("utf-8") or "{}")
        except (UnicodeDecodeError, json.JSONDecodeError):
            return JsonResponse({"error": "Request body must be valid UTF-8 JSON."}, status=400)

        if not isinstance(data, dict):
            return JsonResponse({"error": "Request body must be a JSON object."}, status=400)

        language = data.get("language")
        version = data.get("version")
        code = data.get("code")
        stdin = data.get("input", "")

        if not all(isinstance(value, str) for value in (language, version, code, stdin)):
            return JsonResponse({
                "error": "Invalid request: language, version, code, and input must be strings."
            }, status=400)
        if not language or not version:
            return JsonResponse({"error": "Select a language and runtime version first."}, status=400)

        # Piston's Java runtime appends .java itself; pass a basename, not Main.java.
        filename = "Main" if language == "java" else "main"
        payload = {
            "language": language,
            "version": version,
            "files": [{"name": filename, "content": code}],
            "stdin": stdin,
        }
        result = piston_request("/api/v2/execute", payload)
        if not isinstance(result, dict):
            return JsonResponse({"error": "Piston returned an unexpected response."}, status=502)
        return JsonResponse(result)

    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        return JsonResponse({
            "error": f"Piston returned HTTP {exc.code}.",
            "details": detail,
        }, status=502)
    except urllib.error.URLError as exc:
        return JsonResponse({
            "error": "Could not connect to the Piston server.",
            "details": str(exc.reason),
        }, status=502)
    except Exception as exc:
        return JsonResponse({
            "error": "Could not execute code.",
            "details": str(exc),
        }, status=502)
