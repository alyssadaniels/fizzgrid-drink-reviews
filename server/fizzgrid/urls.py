"""
URL configuration for fizzgrid project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
"""
from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include

from . import views

# index view to render react app
def index_view(request):
    return render(request, 'dist/index.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('reviews/', include(('reviews.urls', 'reviews'), namespace='reviews')),
    path('drinks/', include(('drinks.urls', 'drinks'), namespace='drinks')),
    path('profiles/', include(('profiles.urls', 'profiles'), namespace='profiles')),
    path('issues/', include(('issues.urls', 'issues'), namespace='issues')),
    path('csrf/', views.get_csrf)
]
