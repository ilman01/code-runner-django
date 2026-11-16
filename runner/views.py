import json
import urllib.error
import urllib.request

from django.conf import settings
from django.shortcuts import render
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


@require_http_methods(["GET", "POST"])
def index(request):
    runtimes = []
    runtime_error = ""
    try:
        runtimes = piston_request("/api/v2/runtimes")
    except Exception as exc:
        runtime_error = f"Couldn't load Piston runtimes: {exc}"

    result = None
    form = {
        "language": request.POST.get("language", "java"),
        "version": request.POST.get("version", "15.0.2"),
        "code": request.POST.get("code", default_code),
        "stdin": request.POST.get("stdin", ""),
    }

    if request.method == "POST":
        try:
            payload = {
                "language": form["language"],
                "version": form["version"],
                "files": [{"name": "Main.java" if form["language"] == "java" else "main",
                           "content": form["code"]}],
                "stdin": form["stdin"],
            }
            result = piston_request("/api/v2/execute", payload)
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            result = {"message": f"Piston returned HTTP {exc.code}", "stderr": detail}
        except Exception as exc:
            result = {"message": "Could not execute code", "stderr": str(exc)}

    return render(request, "runner/index.html", {
        "runtimes": runtimes,
        "runtime_error": runtime_error,
        "result": result,
        "form": form,
    })
