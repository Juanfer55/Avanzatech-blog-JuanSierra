# from rest framework
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class LikesPagination(PageNumberPagination):
    """
    Custom pagination class for paginating posts requests.
    """
    page_size = 15
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'total_count': self.page.paginator.count,
            'current_page': self.page.number,
            'total_pages': self.page.paginator.num_pages,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })