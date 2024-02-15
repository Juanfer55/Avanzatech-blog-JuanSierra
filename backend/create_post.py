# models
from posts.models import Posts
from postCategory.models import PostCategory

def create_default_post(itn: int):
    """
    This function creates a default posts with default categories and permissions
    """
    for i in range(itn):
        post = Posts.objects.create(title=f'Default post {i}', content=f'default post content {i}' + 'a'*500, author_id=2)
        for j in range(1, 5):
            PostCategory.objects.create(post=post, category_id=j, permission_id=3)


create_default_post(50)