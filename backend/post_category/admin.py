# from django
from django.contrib import admin
# models
from .models import PostCategory


class PostCategoryAdmin(admin.ModelAdmin):
    """
    Registers the PostCategory model with the Django admin site.
    """
    list_display = ['id', 'post', 'category', 'permission','created_at']
    search_fields = ['title', 'post', 'id']
    ordering = ['-id']
    readonly_fields = ('created_at', 'modified_at')
    fieldsets = (
        ('Post Category Information', {
            'fields': ('post', 'category', 'permission','created_at', 'modified_at'),
        }),
    )

    add_fieldsets = (
        ('Create Post Category', {
            'classes': ('wide',),
            'fields': ('post', 'category', 'permission',),
        }),
    )

    list_filter = ('post', 'category', 'permission')


admin.site.register(PostCategory,PostCategoryAdmin)
