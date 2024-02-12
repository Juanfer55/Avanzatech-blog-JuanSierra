# from django
from django.db import models
# Models
from shared.base_model import BaseModel
from user.models import CustomUser
from posts.models import Posts


class Likes(BaseModel, models.Model):
    """
    Likes model to represent likes on posts by users.

    Defines a foreign key relationship with the CustomUser model.
    Defines a foreign key relationship with the Posts model.
    Inherits from BaseModel.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['user', 'post']

    class Meta:
        unique_together = ['user', 'post']
        ordering = ['id']
        verbose_name = 'Likes'
        verbose_name_plural = 'Likes'

    def __str__(self):
        return f'{self.user.username} likes {self.post.title}'
    
    def save(self, *args, **kwargs):
        """
        Run all field validations before saving the model instance.
        """
        self.full_clean()
        super().save(*args, **kwargs)
