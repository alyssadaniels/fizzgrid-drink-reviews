from django.db import models
from django.contrib.auth.models import User

import uuid
import os

def create_profile_img_filename(instance, filename):
    filename, file_ext = os.path.splitext(filename)
    return f'profile_imgs/{uuid.uuid4()}{file_ext}'

# user
class Profile(models.Model):
    # username, password, email, first_name, last_name
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # profile picture
    profile_img = models.ImageField(blank=True, upload_to=create_profile_img_filename)

# follow
class Follow(models.Model):
    following = models.ForeignKey(Profile, related_name="following", on_delete=models.CASCADE)
    follower = models.ForeignKey(Profile, related_name="follower", on_delete=models.CASCADE)
    date_created = models.DateTimeField()