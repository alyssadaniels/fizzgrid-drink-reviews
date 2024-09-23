from django.contrib import admin

from .models import Drink, DrinkFavorite, DrinkImage

admin.site.register(Drink)
admin.site.register(DrinkFavorite)
admin.site.register(DrinkImage)
