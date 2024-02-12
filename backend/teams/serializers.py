# from rest_framework
from rest_framework import serializers
# model
from .models import Teams


class TeamSerializer(serializers.ModelSerializer):
    """
    Team model serializer.
    """
    class Meta:
        model = Teams
        fields = (
            'name',
        )
