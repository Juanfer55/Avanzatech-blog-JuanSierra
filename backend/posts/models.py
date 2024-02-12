# from django
from django.db import models
from django.core import validators
from django.utils.translation import gettext_lazy as _
# Models
from shared.base_model import BaseModel
from user.models import CustomUser
# utils
from .utils import create_content_excerpt


class Posts(BaseModel, models.Model):
    """
    Post model for blog_avanzatech project.

    Defines Post object with title, content and author.
    """
    title = models.CharField(_('title'), max_length=50, validators=[
                             validators.MinLengthValidator(1), validators.MaxLengthValidator(50)])

    content = models.TextField(_('content'), max_length=1000, validators=[
                               validators.MinLengthValidator(1), validators.MaxLengthValidator(1000)])

    content_excerpt = models.TextField(
        _('content excerpt'), max_length=200, blank=True)

    author = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, blank=False, null=False)

    REQUIRED_FIELDS = ['title', 'content', 'author']

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """
        Run all field validations before saving the model instance.

        Save the first 200 caracters of the content field as the content_excerpt.
        """
        self.content_excerpt = create_content_excerpt(self.content)
        self.full_clean()
        super().save(*args, **kwargs)
