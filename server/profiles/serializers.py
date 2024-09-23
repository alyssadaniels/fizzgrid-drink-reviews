from rest_framework import serializers
from .models import Profile, Follow
from django.contrib.auth.models import User


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "user_id", "profile_img"]

    profile_img = serializers.SerializerMethodField()

    def get_profile_img(self, obj):
        if obj.profile_img:
            return obj.profile_img.url.split("?")[0]
        else:
            return None


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ["id", "following_id", "follower_id"]


class UserLimitedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]
