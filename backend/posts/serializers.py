# from django
from django.db import transaction
from django.db.models import Q, When, Case, Value, IntegerField, F
# Django REST Framework
from rest_framework import serializers
# Modela
from .models import Posts
from postCategory.models import PostCategory
from permissions.models import PermissionLevels
# Serializers
from user.serializers import AuthorSerializer
# Constants
from shared.constants import Category

class PostsBaseModelSerializer(serializers.ModelSerializer):
    """
    Posts base model serializer for the list and retrieve view.

    Includes the author serializer and the permissions.
    """

    author = AuthorSerializer(read_only=True)
    public_permission = serializers.SerializerMethodField()
    authenticated_permission = serializers.SerializerMethodField()
    team_permission = serializers.SerializerMethodField()
    author_permission = serializers.SerializerMethodField()

    def get_permission_level(self, obj, category):
        """Get the permission level for the given category."""
        category_permission = PostCategory.objects.filter(post=obj, category__id=category).first()
        if category_permission:
            return category_permission.permission.permission_level
        return None

    def get_public_permission(self, obj):
        return self.get_permission_level(obj, Category.PUBLIC)
    
    def get_authenticated_permission(self, obj):
        return self.get_permission_level(obj, Category.AUTHENTICATED)
    
    def get_team_permission(self, obj):
        return self.get_permission_level(obj, Category.TEAM)


    def get_author_permission(self, obj):
        return self.get_permission_level(obj, Category.AUTHOR)

class PostsListModelSerializer(PostsBaseModelSerializer):
    """
    Posts model serializer for the list view.

    Uses the PostsBaseModelSerializer to get the author and permissions.
    """
    class Meta:
        model = Posts
        fields = (
            'id',
            'author',
            'title',
            'content_excerpt',
            'public_permission',
            'authenticated_permission',
            'team_permission',
            'author_permission',
            'created_at',
        )


class PostRetrieveModelSerializer(PostsBaseModelSerializer):
    """
    Posts model serializer for the retrieve view.

    Uses the PostsBaseModelSerializer to get the author and permissions.
    """
    class Meta:
        model = Posts
        fields = (
            'id',
            'title',
            'author',
            'content',
            'public_permission',
            'authenticated_permission',
            'team_permission',
            'author_permission',
            'created_at',
        )

        read_only_fields = (
            'id',
            'created_at',
        )


class CreateUpdateModelSerializer(serializers.ModelSerializer):
    """
    Posts model serializer for the create and update endpoints.
    """

    author = AuthorSerializer(read_only=True)
    public_permission = serializers.PrimaryKeyRelatedField(
        queryset=PermissionLevels.objects.all(), 
        required=True, 
        write_only=True
    )
    authenticated_permission = serializers.PrimaryKeyRelatedField(
        queryset=PermissionLevels.objects.all(), 
        required=True, 
        write_only=True
    )
    team_permission = serializers.PrimaryKeyRelatedField(
        queryset=PermissionLevels.objects.all(), 
        required=True, 
        write_only=True
    )
    author_permission = serializers.PrimaryKeyRelatedField(
        queryset=PermissionLevels.objects.all(), 
        required=True, 
        write_only=True
    )

    class Meta:
        model = Posts
        fields = (
            'id',
            'title',
            'content',
            'public_permission',
            'authenticated_permission',
            'team_permission',
            'author_permission',
            'author',
            'created_at',
        )

        read_only_fields = (
            'id',
            'created_at',
        )

    @transaction.atomic
    def create(self, validated_data):
        """
        Creates a transaction for the post and permissions creation.

        If something goes wrong, the transaction is rolled back.
        """
        # I get the request user
        user = self.context['request'].user

        # I take the permissions from the validated data
        public = validated_data.pop('public_permission')
        authenticated = validated_data.pop('authenticated_permission')
        team = validated_data.pop('team_permission')
        author = validated_data.pop('author_permission')

        # First, create the post with the request user as the author
        post = Posts.objects.create(author=user, **validated_data)

        # Second, set the permissions for the post
        PostCategory.objects.bulk_create([
            PostCategory(post=post, category_id=Category.PUBLIC, permission=public),
            PostCategory(post=post, category_id=Category.AUTHENTICATED, permission=authenticated),
            PostCategory(post=post, category_id=Category.TEAM, permission=team),
            PostCategory(post=post, category_id=Category.AUTHOR, permission=author),
        ])

        return post

    @transaction.atomic
    def update(self, instance, validated_data):
        """
        Creates a transaction for the post and permissions update.

        If something goes wrong, the transaction is rolled back.
        """
        # I update the post title and content
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()

        # I take the permissions from the validated data
        public = validated_data.pop('public_permission')
        authenticated = validated_data.pop('authenticated_permission')
        team = validated_data.pop('team_permission')
        author = validated_data.pop('author_permission')

        # Finally, Update the permissions
        PostCategory.objects.filter(
            Q(post=instance, category_id=Category.PUBLIC) |
            Q(post=instance, category_id=Category.AUTHENTICATED) |
            Q(post=instance, category_id=Category.TEAM) |
            Q(post=instance, category_id=Category.AUTHOR)
        ).update(
            permission_id=Case(
                When(category_id=Category.PUBLIC, then=Value(public.id)),
                When(category_id=Category.AUTHENTICATED, then=Value(authenticated.id)),
                When(category_id=Category.TEAM, then=Value(team.id)),
                When(category_id=Category.AUTHOR, then=Value(author.id)),
                default=F('permission_id'),
                output_field=IntegerField() 
            )
        )

        return instance
