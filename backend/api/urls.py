# from django
from django.urls import path, include


urlpatterns = [
    path('auth/', include('user.urls'),),
    path('post/', include('posts.postUrls')),
    path('blog/', include('posts.blogUrls')),
    path('like/', include('likes.urls')),
    path('comment/', include('comments.urls')),
    path('categories/', include('categories.urls')),
    path('permissions/', include('permissions.urls')),
]
