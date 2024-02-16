# from django
from django.contrib import admin
# models
from .models import Comments


class CommentsAdmin(admin.ModelAdmin):
    """
    Registers the Comments model with the Django admin site.
    """
    list_display = ['id', 'user', 'post']
    search_fields = ['user', 'post']
    ordering = ['id']
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Comment Information', {
            'fields': ('user', 'post', 'content', 'created_at'),
        }),
    )

    add_fieldsets = (
        ('Comment a Post', {
            'classes': ('wide',),
            'fields': ('user', 'post', 'content'),
        }),
    )

    list_filter = ('user', 'post')


admin.site.register(Comments, CommentsAdmin)
