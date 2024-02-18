# models
from posts.models import Posts
from postCategory.models import PostCategory
from comments.models import Comments

text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex facilis vero perspiciatis numquam asperiores voluptatum officiis excepturi similique, ipsum sapiente, aut quasi nemo consectetur? Quos quibusdam corrupti dolorum dignissimos. Aut! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam repellat accusantium magnam excepturi provident autem, asperiores voluptatem enim porro nemo veritatis, adipisci blanditiis incidunt iste, corporis fugiat magni numquam nulla? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex facilis vero perspiciatis numquam asperiores voluptatum officiis excepturi similique, ipsum sapiente, aut quasi nemo consectetur? Quos quibusdam corrupti dolorum dignissimos. Aut! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam repellat accusantium magnam excepturi provident autem, asperiores voluptatem enim porro nemo veritatis, adipisci blanditiis incidunt iste, corporis fugiat magni numquam nulla? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex facilis vero perspiciatis numquam asperiores voluptatum officiis excepturi similique, ipsum sapiente, aut quasi nemo consectetur? Quos quibusdam corrupti dolorum dignissimos. Aut! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam repellat accusantium magnam excepturi provident autem, asperiores voluptatem enim porro nemo veritatis, adipisci blanditiis incidunt iste, corporis fugiat magni numquam nulla? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex facilis vero perspiciatis numquam asperiores voluptatum officiis excepturi similique, ipsum sapiente, aut quasi nemo consectetur? Quos quibusdam corrupti dolorum dignissimos. Aut! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam repellat accusantium magnam excepturi provident autem, asperiores voluptatem enim porro nemo veritatis, adipisci blanditiis incidunt iste, corporis fugiat magni numquam nulla?'

comment = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex facilis vero perspiciatis numquam asperiores voluptatum officiis excepturi similique, ipsum sapiente, aut quasi nemo consectetur? Quos quibusdam corrupti dolorum dignissimos. Aut! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam repellat accusantium magnam excepturi provident autem, asperiores voluptatem enim porro nemo veritatis, adipisci blanditiis incidunt iste, corporis fugiat magni numquam nulla? Lorem ipsum dolor sit amet consectetur adipisicing elit.'

def create_default_post(itn: int):
    """
    This function creates a default posts with default categories and permissions
    """
    for i in range(itn):
        post = Posts.objects.create(title=f'Default post {i}', content=text, author_id=2)
        for j in range(1, 5):
            PostCategory.objects.create(post=post, category_id=j, permission_id=3)
        for k in range(10):
            Comments.objects.create(post=post, user_id=1, content=comment)



create_default_post(50)