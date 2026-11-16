from django.urls import path
from runner.views import index

urlpatterns = [path("", index, name="index")]
