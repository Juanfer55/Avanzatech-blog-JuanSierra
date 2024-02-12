# Django REST Framework
from rest_framework import serializers
# Models
from .models import CustomUser
# Serializers
from teams.serializers import TeamSerializer


class UserModelSerializer(serializers.ModelSerializer):
    """"
    User model serializer
    """

    team = TeamSerializer(read_only=True)
    class Meta:

        model = CustomUser
        fields = (
            'id',
            'username',
            'team',
            'is_admin',
        )

class CreateUserModelSerializer(serializers.ModelSerializer):
    """"
    Serializer for the register view
    """

    class Meta:
        model = CustomUser
        fields = (
            'username',
            'password',
        )

class AuthorSerializer(serializers.ModelSerializer):
    """
    Author model serializer.
    """
    team = TeamSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'id',
            'username',
            'team',
        )