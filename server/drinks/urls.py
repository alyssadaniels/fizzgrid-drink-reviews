from django.urls import path

from . import views

urlpatterns = [
    path("", views.DrinkList.as_view(), name="drink_list"),
    path(
        "drink/",
        views.DrinkDetail.as_view(http_method_names=["post"]),
        name="drink_detail_post",
    ),
    path(
        "drink/<int:drink_id>/",
        views.DrinkDetail.as_view(http_method_names=["get", "delete"]),
        name="drink_detail",
    ),
    path(
        "drink/<int:drink_id>/favorite/",
        views.FavoriteDetail.as_view(),
        name="favorite_detail",
    ),
    path(
        "images/",
        views.ImageList.as_view(),
        name="drink_image_list",
    ),
    path(
        "favorites/",
        views.FavoriteList.as_view(),
        name="favorite_list",
    ),
]
