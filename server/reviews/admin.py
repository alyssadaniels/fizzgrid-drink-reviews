from django.contrib import admin

from .models import CommentLike, Review, Comment, ReviewImage, ReviewLike

admin.site.register(Review)
admin.site.register(Comment)
admin.site.register(ReviewImage)
admin.site.register(CommentLike)
admin.site.register(ReviewLike)
