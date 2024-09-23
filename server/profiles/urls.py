from django.urls import path
from . import views

urlpatterns = [
    path("", views.ProfileList.as_view()),
    path("login/", views.login_user),
    path("logout/", views.logout_user),
    path("profile/<int:profile_id>/", views.ProfileDetail.as_view()),
    path(
        "profile/",
        views.AuthenticatedProfileDetail.as_view(),
    ),
    path("follows/", views.FollowList.as_view()),
    path("profile/<int:following_id>/follow/", views.FollowDetail.as_view()),
]
