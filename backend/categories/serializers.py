# Django rest framework
from rest_framework import serializers
# Model
from .models import Categories


class CategoriesListModelSerializer(serializers.ModelSerializer):
    """
    Posts model serializer for the list and create view.
    """
    class Meta:
        model = Categories
        fields = (
            'id',
            'name',
        )
