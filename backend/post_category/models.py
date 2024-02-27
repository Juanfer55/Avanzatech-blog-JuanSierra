# from django
from django.db import models
from django.core import validators
from django.utils.translation import gettext_lazy as _
# Models
from shared.base_model import BaseModel
from posts.models import Posts
from categories.models import Categories
from permissions.models import PermissionLevels


class PostCategory(BaseModel, models.Model):
    """
    PostCategory model.

    Defines PostCategory object with post, category and permission.
    """

    post = models.ForeignKey(Posts, on_delete=models.CASCADE, blank=False, null=False)

    category = models.ForeignKey(Categories, on_delete=models.CASCADE, blank=False, null=False)

    permission = models.ForeignKey(PermissionLevels, on_delete=models.CASCADE, blank=False, null=False)

    REQUIRED_FIELDS = ['category', 'permission_level']

    class Meta:
        unique_together = ['post', 'category']
        ordering = ['pk']
        verbose_name = 'Post Category'
        verbose_name_plural = 'Post Category'

    def __str__(self):
        return f'{self.post.title} - {self.category.name} - {self.permission.permission_level}'

    def save(self, *args, **kwargs):
        """
        Run all field validations before saving the model instance.
        """
        self.full_clean()
        super().save(*args, **kwargs)
