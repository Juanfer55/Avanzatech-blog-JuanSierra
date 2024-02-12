# from Django Rest Framework
from rest_framework import generics
# Serializers
from .serializers import PermissionLevelmModelSerializer
# Models
from permissions.models import PermissionLevels


class PermissionLevelsListView(generics.ListAPIView,):
    """
    Permission level list view.
    """ 
    serializer_class = PermissionLevelmModelSerializer
    queryset = PermissionLevels.objects.all()
