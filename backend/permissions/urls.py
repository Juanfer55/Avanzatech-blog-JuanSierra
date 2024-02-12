"""Urls for categories app"""
# from django
from django.urls import path
# views
from .views import PermissionLevelsListView


urlpatterns = [
    path('',
         PermissionLevelsListView.as_view(),
         name='permissions-list'),
]
