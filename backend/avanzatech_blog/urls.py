"""
URL configuration for avanzatech_blog project.
"""
# from django
from django.contrib import admin
from django.urls import include, path
# from rest framework
from rest_framework.documentation import include_docs_urls


urlpatterns = [
    path('admin/', admin.site.urls),
    path('docs/', include_docs_urls(title='Avanzatech Blog API')),
    path('api/', include('api.urls')),
]
