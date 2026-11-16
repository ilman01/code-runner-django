from django.urls import path
from runner.views import index, run_code

urlpatterns = [
    path("", index, name="index"),
    path("api/run/", run_code, name="run_code"),
]
