"""Urls for categories app"""
# from django
from django.urls import path
# views
from categories.views import CategoriesListView


urlpatterns = [
    path('',
         CategoriesListView.as_view(),
         name='categories-list'),
]
