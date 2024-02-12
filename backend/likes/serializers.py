# Django REST Framework
from rest_framework import serializers
# Models
from .models import Likes
# serializers
from posts.serializers import AuthorSerializer


class LikeModelSerializer(serializers.ModelSerializer):
    """"Posts model serializer."""

    user = AuthorSerializer(read_only=True)

    class Meta:

        model = Likes
        fields = (
            "id",
            'user',
            'post',
        )

        read_only_fields = (
            'id',
            'user',
        )
