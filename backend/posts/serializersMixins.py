# serializers
from .serializers import CreateUpdateModelSerializer, PostRetrieveModelSerializer, PostsListModelSerializer

class PostSerializerMixin:
    """
    Set the serializer base on the request method.
    """
    def get_serializer_class(self):

        if self.kwargs.get('pk') and self.request.method == 'GET':
            return PostRetrieveModelSerializer
        elif self.request.method == 'GET':
            return PostsListModelSerializer
        else:
            return CreateUpdateModelSerializer

