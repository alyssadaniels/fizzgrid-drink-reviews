from rest_framework import serializers
from .models import Drink, DrinkFavorite, DrinkImage


class DrinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drink
        fields = "__all__"


class DrinkFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrinkFavorite
        fields = ["id", "drink_id", "profile_id"]


class DrinkImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrinkImage
        fields = ["id", "drink_id", "label", "image"]

    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            return obj.image.url.split("?")[0]
        else:
            return None
