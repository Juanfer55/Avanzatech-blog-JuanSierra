# from django
from django.contrib import admin
# models
from .models import Likes


class LikesAdmin(admin.ModelAdmin):
    """
    Registers the Likes model with the Django admin site
    """
    list_display = ['id', 'user', 'post']
    search_fields = ['user', 'post']
    ordering = ['id']
    readonly_fields = ('created_at', 'modified_at')
    fieldsets = (
        ('Post Information', {
            'fields': ('user', 'post'),
        }),
    )

    add_fieldsets = (
        ('Like a Post', {
            'classes': ('wide',),
            'fields': ('user', 'post'),
        }),
    )

    list_filter = ('user', 'post')


admin.site.register(Likes, LikesAdmin)
