from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from profiles.models import Profile
from drinks.models import Drink, DrinkImage

# review
class Review(models.Model):
    date_created = models.DateTimeField()
    rating = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.CharField(max_length=4096)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="profile")
    drink = models.ForeignKey(Drink, on_delete=models.CASCADE, related_name="drink")

# review like
class ReviewLike(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

# comment
class Comment(models.Model):
    date_created = models.DateTimeField()
    comment_text = models.CharField(max_length=280)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

# comment like
class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

# review image
class ReviewImage(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    image = models.ForeignKey(DrinkImage, on_delete=models.CASCADE)