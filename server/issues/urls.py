from django.urls import path
from . import views

urlpatterns = [
    path("request-drink/", views.RequestDrinkDetail.as_view(), name="request-drink"),
    path("report-issue/", views.ReportIssueDetail.as_view(), name="report-issue"),
]
