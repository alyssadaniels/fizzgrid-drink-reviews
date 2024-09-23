import os
import uuid
from django.db import models
from profiles.models import Profile

def create_drink_img_filename(instance, filename):
    filename, file_ext = os.path.splitext(filename)
    return f'drink_imgs/{uuid.uuid4()}{file_ext}'

# drink
class Drink(models.Model):
    product_name = models.CharField(max_length=300)
    brand_name = models.CharField(max_length=300)

    def __str__(self):
        return f'{self.pk}: {self.product_name} - {self.brand_name}'

# favorites
class DrinkFavorite(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    drink = models.ForeignKey(Drink, on_delete=models.CASCADE)
    date_created = models.DateTimeField()

# images
class DrinkImage(models.Model):
    label = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to=create_drink_img_filename)
    drink = models.ForeignKey(Drink, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return f'{self.pk}: {self.label} (for drink {self.drink.pk})'