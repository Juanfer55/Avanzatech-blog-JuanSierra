# Django REST Framework
from rest_framework import serializers
# Models
from .models import Comments
# Serializers
from user.serializers import AuthorSerializer


class PostsCommentModelSerializer(serializers.ModelSerializer):
    """"Posts model serializer."""

    user = AuthorSerializer(read_only=True)

    class Meta:

        model = Comments
        fields = (
            "id",
            'user',
            'post',
            'content',
            'created_at',
        )

        read_only_fields = (
            'id',
            'user',
            'created_at',
        )


    def get_post(self, obj):
        """Get post title from post."""
        return obj.post.id
