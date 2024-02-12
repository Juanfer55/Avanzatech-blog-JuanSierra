# from django
from django.contrib import admin
# models
from .models import Posts


class PostsAdmin(admin.ModelAdmin):
    """
    Registers the Posts model with the Django admin site.
    """
    list_display = ['id', 'title', 'author', 'created_at']
    search_fields = ['title', 'author__username', 'id']
    ordering = ['-id']
    readonly_fields = ('created_at', 'modified_at', 'content_excerpt')
    fieldsets = (
        ('Post Information', {
            'fields': ('title', 'author', 'content', 'content_excerpt', 'created_at', 'modified_at'),
        }),
    )

    add_fieldsets = (
        ('Create Post', {
            'classes': ('wide',),
            'fields': ('title', 'content', 'author'),
        }),
    )

    list_filter = ('title', 'author__username', 'id')


admin.site.register(Posts, PostsAdmin)
