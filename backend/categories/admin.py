# from django
from django.contrib import admin
# models
from categories.models import Categories


class CategoriesAdmin(admin.ModelAdmin):
    """
    Registers the categories model with the Django admin site.
    """
    list_display = ['id', 'name', 'created_at',]
    search_fields = ['name']
    ordering = ['id']
    readonly_fields = ('id', 'created_at', 'modified_at',)
    fieldsets = (
        ('Permission Information', {
            'fields': ('name', 'created_at', 'modified_at'),
        }),
    )

    add_fieldsets = (
        ('Creat Permission', {
            'classes': ('wide',),
            'fields': ('name', ),
        }),
    )

    list_filter = ('name',)


admin.site.register(Categories, CategoriesAdmin)
