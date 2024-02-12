# Permission querysets
from shared.permissionsQuerysets import read_permission_querySet, edit_permission_queryset

class PostQuerySetMixin():
    """
    Sets the queryset according to the request method.

    If the request method is GET, then the queryset will be the queryset
    of all the posts that the user has read permission for.

    If the request method is POST, PUT, or DELETE, then the queryset will be
    the queryset of all the posts that the user has edit permission for.
    """

    def get_queryset(self, *args, **kwargs):
        user = self.request.user

        if self.request.method == 'GET':
            return read_permission_querySet(user)
        else:
            return edit_permission_queryset(user)