# from Django Rest Framework
from rest_framework import generics
# filters
from django_filters import rest_framework as filters
from .filters import CommentsFilter
# Serializers
from .serializers import PostsCommentModelSerializer
# Custom pagination
from .pagination import CommentsPagination
# QuerySet
from .querysetMixins import CommentsPermissionQuerySet
# mixins
from shared.validators import validate_user_read_permissions
# Permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated


class CommentListFilterCreateView(
        CommentsPermissionQuerySet,
        generics.ListCreateAPIView):
    """
    View for listing and filtering Comments.

    Inherits from CommentsPermissionQuerySet to apply read permissions.
    Uses CommentsPagination for custom pagination.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = CommentsPagination
    serializer_class = PostsCommentModelSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = CommentsFilter

    def perform_create(self, serializer):
        """
        Sets the comment owner to the logged in user.
        Validates the user has read permissions on the post.
        """
        user = self.request.user
        post = serializer.validated_data.get('post')
        validate_user_read_permissions(user, post)
        serializer.save(user=user)


class CommentDestroyView(
        CommentsPermissionQuerySet,
        generics.DestroyAPIView):
    """
    View for delete posts comments.

    Inherits from CommentsPerimissionQuerySet to apply read permissions.
    """
    permission_classes = [IsAuthenticated]
    
