# from Django Rest Framework
from rest_framework import generics
# Custom pagination
from .pagination import PostsPagination
# Querysetmixins
from .querysetMixins import PostQuerySetMixin
# serializer mixin
from .serializersMixins import PostSerializerMixin
# Permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class PostListCreateView(
        PostQuerySetMixin,
        PostSerializerMixin,
        generics.ListCreateAPIView,):
    """
    Post list and create view.

    Inherits from PostQuerySetMixin to apply read permissions.
    Inherits from SerializerMixin to apply serializer base on request method.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = PostsPagination


class PostRetrieveView(
        PostQuerySetMixin,
        PostSerializerMixin,
        generics.RetrieveAPIView):
    """
    Post retrieve view.

    Inherits from PostQuerySetMixin to apply read permissions.
    Inherits from SerializerMixin to apply serializer base on request method.
    """


class PostUpdateDeleteView(
        PostQuerySetMixin,
        PostSerializerMixin,
        generics.UpdateAPIView,
        generics.DestroyAPIView):
    """
    Post delete and retrieve view.

    Inherits from PostQuerySetMixin to apply edit permissions.
    Inherits from SerializerMixin to apply serializer base on request method.
    """
