from rest_framework import serializers
from .models import Review, ReviewImage, ReviewLike, Comment, CommentLike


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id",
            "review_text",
            "rating",
            "date_created",
            "drink_id",
            "profile_id",
        ]


class ReviewLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewLike
        fields = ["id", "review_id", "profile_id"]


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = ["id", "review_id", "image_id"]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "review_id", "profile_id", "comment_text", "date_created"]


class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ["id", "comment_id", "profile_id"]
