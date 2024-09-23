from django.urls import path

from . import views

urlpatterns = [
    path("", views.ReviewList.as_view(), name="review_list"),
    path("review/", views.ReviewDetail.as_view(http_method_names=["post"]), name="review_detail"),
    path(
        "review/<int:review_id>/", views.ReviewDetail.as_view(http_method_names=["get", "delete"]), name="review_id_detail"
    ),
    path("comment/", views.CommentDetail.as_view(http_method_names=["post"]), name="comment_detail"),
    path(
        "comment/<int:comment_id>/",
        views.CommentDetail.as_view(http_method_names=["get", "delete"]),
        name="comment_id_detail",
    ),
    path(
        "comment-likes/",
        views.CommentLikeList.as_view(),
        name="comment_like_list",
    ),
    path(
        "comment/<int:comment_id>/like/",
        views.CommentLikeDetail.as_view(),
        name="comment_like_detail",
    ),
    path(
        "review/<int:review_id>/like/",
        views.ReviewLikeDetail.as_view(),
        name="review_like_detail",
    ),
    path(
        "images/",
        views.ImageList.as_view(),
        name="review_image_list",
    ),
    path(
        "comments/",
        views.CommentList.as_view(),
        name="comment_list",
    ),
    path(
        "review-likes/",
        views.ReviewLikeList.as_view(),
        name="review_like_list",
    ),
]
