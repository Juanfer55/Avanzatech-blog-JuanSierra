# from django
from django.urls import path
# views
from .views import LikesListFilterCreateView, UnlikeView

urlpatterns = [
    path('', LikesListFilterCreateView.as_view(), name='likes-list-filter-create'),
    path('<int:pk>/', UnlikeView.as_view(), name='unlike'),
]