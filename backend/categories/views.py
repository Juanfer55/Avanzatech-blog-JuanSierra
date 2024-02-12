# from Django Rest Framework
from rest_framework import generics
# Serializers
from .serializers import CategoriesListModelSerializer
# Models
from categories.models import Categories


class CategoriesListView(generics.ListAPIView,):
    """
    List all categories.
    """ 
    serializer_class = CategoriesListModelSerializer
    queryset = Categories.objects.all()
