# Django rest framework
from rest_framework import serializers
# Model
from .models import PermissionLevels


class PermissionLevelmModelSerializer(serializers.ModelSerializer):
    """
    Posts model serializer for the list and create view.
    """
    class Meta:
        model = PermissionLevels
        fields = (
            'id',
            'permission_level',
        )
