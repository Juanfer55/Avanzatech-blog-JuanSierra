# from django
from django.db import models
from django.core import validators

# Models
from shared.base_model import BaseModel
from user.models import CustomUser
from posts.models import Posts


class Comments(BaseModel, models.Model):
    """
    Comment model to represent comments on posts by users.

    Likes model to represent likes on posts by users.

    Defines a foreign key relationship with the CustomUser model.
    Defines a foreign key relationship with the Posts model.
    Inherits from BaseModel.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)
    content = models.TextField(max_length=200, validators=[
                               validators.MinLengthValidator(1), validators.MaxLengthValidator(500)])

    REQUIRED_FIELDS = ['user', 'post', 'content']

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Comments'
        verbose_name_plural = 'Comments'

    def __str__(self):
        return f'{self.user.username} comment on {self.post.title}'

    def save(self, *args, **kwargs):
        """
        Run all field validations before saving the model instance.
        """
        self.full_clean()
        super().save(*args, **kwargs)