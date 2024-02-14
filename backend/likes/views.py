# from Django Rest Framework
from rest_framework import generics
from rest_framework.exceptions import ValidationError
# filters
from django_filters import rest_framework as filters
from .filters import LikesFilter
# Serializers
from .serializers import LikeModelSerializer
# Custom pagination
from .pagination import LikesPagination
# Custom Query Set
from .querysetMixins import LikesPermissionQuerySet
# validators
from shared.validators import validate_user_read_permissions
# models
from likes.models import Likes
# permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class LikesListFilterCreateView(
        LikesPermissionQuerySet,
        generics.ListCreateAPIView):
    """
    View for listing and filtering likes.

    Inherits from LikesPerimissionQuerySet to apply read permissions.
    Uses LikesPagination for custom pagination.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = LikesPagination
    serializer_class = LikeModelSerializer

    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = LikesFilter

    def perform_create(self, serializer):
        """
        Sets the like owner to the logged in user.
        Validates the user has read permissions on the post.
        """
        user = self.request.user
        post = serializer.validated_data['post']
        if Likes.objects.filter(user=user, post=post).exists():
            raise ValidationError({"detail": "User already liked this post"})
        validate_user_read_permissions(user, post)
        serializer.save(user=user)

@method_decorator(csrf_exempt, name='dispatch')
class UnlikeView(
        LikesPermissionQuerySet,
        generics.DestroyAPIView):
    """
    View for unlike a post give the like id.

    Inherits from LikesPerimissionQuerySet to apply read permissions.
    """
    permission_classes = [IsAuthenticated]
