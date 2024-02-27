## Blog avanzatech API Documentation

This is the documentation of the Blog avanzatech API created by Juan Fernando Sierra. This API contains endpoints to create, modify, delete, list, like and comment blog posts.


The project is composed of 8 modules that contain different functionalities:


- avanzatech_blog: It is the main module, it contains the configuration files of the djando project and the main root of the urls.

- api: Contains the url addresses of the api.

- shared: Contains utilities used in the project, reducing code repetition.

- users: Contains the custom user model with views for login, register and logout.

- posts: Contains the posts model, serializers and views.

- permissions: Contains the permission levels model.

- postCategory: Contains the post permission for each category.

- comments: Contains the comments, serializers and views model.

- likes: Contains the likes, serializers and views model.

- testing_utilities: Contains factories and utilities to configure the testing environments.

## Set up

In order to install and run the project on your machine you must do the following:

1. Clone the repository on your computer.

```
$ git clone git@github.com:Juanfer55/etapa7_django_juanfer.git
```

2. Verify that you have pipenv installed, otherwise install it:

```
$ pip install pipenv

$ python3 -m pip install --upgrade pipenv
```

2. Install the project dependencies and activate the virtual environment created by pipenv:

```
$ pipenv --python <path/to/python> install

$ pipenv install
```

For more details on how to install pipenv and create a virtual environment, check the following link: https://pipenv-es.readthedocs.io/es/latest/

3. Perform the project migrations:

-- Inside your virtual environment run the following command:
```
$ python manage.py makemigrations

$ python manage.py migrate
```

4. Run test:

-- Inside your virtual environment run the following command:
```
$ python manage.py test
```

This command will run all unittests and show the results.

4. Start the server:

-- Inside your virtual environment run the following command:
```
python manage.py runserver 8000
```

5. Create a superuser:

-- Inside your virtual environment run the following command:
```
$ python manage.py createsuperuser
```

Insert the username(email) and the password you want to use for the superuser.

6. Go to the admin panel and login with the superuser credentials created in the previous step.

Endpoint = http://127.0.0.1:8000/admin/

There you would have access to the admin panel of the project. In the admin site you will be able to create, modify and delete users; create, modify, delete, list, like and comment blog posts.


## Endpoint 1: Blog Post Creation with Permissions 

Endpoint: http://127.0.0.1:8000/api/post/

Method: POST

The request body should be an "application/json" encoded object, containing all of the the following items:

```
{
    "title": "Post title",
    "content": "Post Content",
    "public_permission": 1,
    "authenticated_permission": 1,
    "team_permission": 1,
    "author_permission": 1
}
```

Important: All fields are mandatory. If any of the fields are not sent the server will return the 400 badrequest status with the missing fields.

Details of each field:

- title:  cannot be an empty string or longer than 50 characters.
- content: cannot be an empty string or longer than 10000 characters.
- public_permission: a numerical value between 1 and 3 that represent a permission level for the category.
- authenticated_permission: a numerical value between 1 and 3 that represent a permission level for the category.
- team_permission: a numerical value between 1 and 3 that represent a permission level for the category.
- author_permission: a numerical value between 1 and 3 that represent a permission level for the category.

The following permission levels are available in the project:

- 1 = None => cannot read or edit
- 2 = read-only => Only can read
- 3 = Team: => can read and edit the post

The permission level are created by default in the data base and each category must have one of the valid permission level.


If one of the submitted fields does not meet these specifications the server will not create the post and will return a 400 badrequest status specifying the error.

```
{
    "content": [
        "This field may not be blank."
    ]
}
```

A user must be logged in or authenticated to create a post. If the user is not authenticated, the server will return a 403 forbidden status.

The Author is automatically set as the logged-in user.

If the request was successful the server will return the 201 created status with the post created without the permissions:

```
{
    "id": 1,
    "title": "Post",
    "author": {
        "id": 1,
        "username": "user@gmail.com",
        "team": {
            "id": 1
            "name": 'Default'
        }
    }
    "content": "Content",
    "created_at": "2023-12-19T20:24:52.025909Z"
}
```

The permission will be created in the post_category table.


## Endpoint 2: Blog Post Editing and Permission Modification  

Endpoint: http://127.0.0.1:8000/api/blog/post_id/

Method: P

This endpoint can be used to modify the title, content and permissions of a blog post.
Admin users can edit any posts regardless of the permissions.

The request body should be a "application/json" encoded object, containing the the following items:



```
{
    "title": "Change title",
    "content": "Change Content",
    "public_permission": 2,
    "authenticated_permission": 2,
    "team_permission": 2,
    "author_permission": 2
}
```

Note that the fields that can be updated through this endpoint are:

- title:  cannot be an empty string or longer than 50 characters.
- content: cannot be an empty string or longer than 200 characters.
- public_permission: a numerical value between 1 and 3 that represent a permission level for the category.
- authenticated_permission: a numerical value between 1 and 3 that represent a permission level for the category.
- team_permission: a numerical value between 1 and 3 that represent a permission level for the category.
- author_permission: a numerical value between 1 and 3 that represent a permission level for the category.

If one of the submitted fields does not meet these specifications the server will not update the post and will return a 400 badrequest status specifying the error.

```
{
    "title": [
        "This field may not be blank."
    ]
}
```

If the request was successful the server will return the 200 ok status with the updated post without the permissions:

```
{
    "id": 1,
    "title": "Change title",
    "author": {
        "id": 1,
        "username": "user@gmail.com",
        "team": {
            "id": 1
            "name": "Deafault"
        }
    }
    "content": "Change content",
    "created_at": "2023-12-19T20:36:32.058658Z"
}
```

Editing follows the permissions set on the post before the attempt to edit the post.


## Endpoint 3: Viewing and Interacting with Posts Based on Permissions

List Posts Endpoint = http://127.0.0.1:8000/api/post/

Method = GET

This endpoint returns the posts that the user has permission to view or a empty list if the user does not have view access to any post.
Admin users can see all posts regardless of the permissions.

If the submitting user has posts to view the server will return a 200 ok status with the posts he has permission to view as follows:

```
{
    "total_count": 2,
    "current_page": 1,
    "total_pages": 1,
    "next": null,
    "previous": null,
    "results": [

        {
            "id": 1,
            "title": "Post",
            "author": {
                "id": 1,
                "username": "user@gmail.com",
                "team": {
                    "id": 1
                    "name": "Default"
                }
            }
            "content_excerpt": "Content excerpt",
            "public_permission": 2,
            "authenticated_permission": 2,
            "team_permission": 2,
            "author_permission": 2
            "created_at": "2023-12-19T20:24:52.025909Z"
        }
    ]
}
```
This endpoint returns the post with the excerpt of the content.

Pagination is implemented to limit the number of posts per page to 10.
Pagination include the following information: current page, total pages, total count, next page URL, previous page URL.

If the user sending the request has no posts to display the server will return a 200 ok status followed by the following message:

```
{
    "total_count": 0,
    "current_page": 1,
    "total_pages": 0,
    "next": null,
    "previous": null,
    "results": []
}
```

## Endpoint 3.1: Viewing and Interacting with Posts Based on Permissions, detail view

Detail Posts Endpoint = http://127.0.0.1:8000/api/post/post_id/

Method = GET

This endpoint returns the post that the user has permission to view or a 404 not found status if the user does not have view access to the post.

If the user has permission to view the post the server will return a 200 ok status with the post as follows:

```
{
    "id": 1,
    "title": "Post",
    "author": {
        "id": 1,
        "username": "user@gmail.com",
        "team": {
            "id": 1
            "name": "Default"
        }
    }
    "content": "Content",
    "public_permission": 2,
    "authenticated_permission": 2,
    "team_permission": 2,
    "author_permission": 2
    "created_at": "2023-12-19T20:24:52.025909Z"
}
```


## Endpoint  4: Adding Likes to a Blog Post

Endpoint: http://127.0.0.1:8000/api/like/

Methods: POST

At this enpoint a logged in user can give likes on posts to which he has read permission.

To create a like the user must be logged in and send a POST request to the endpoint.

The request body should be a "application/json" encoded object, containing the the following items:

```
{
    "post": 1
}
```


If the user does not have read permission on the post or the post does not exist the server returns a 404 not found status. 

```
{
    "detail": "Not found."
}
```

If the like request was succesfull the server will return the 201 created status with the like created:

```
{
    "id": 1,
    "user": {
        "id": 1,
        "username": "user@gmail.com",
        "team": "team name"
    }
    "post": 1
}
```

If the user tries to like a post that he already like, the server returns a 400 badrequest status.

```
{
    "detail": "User already liked this post"
}
```

## Endpoint  4.1: Adding Likes to a Blog Post

Endpoint: http://127.0.0.1:8000/api/like/like_id

Methods: DELETE

At this enpoint a logged in user can unlike posts to which he has read permission.
The like id must be send as a url parameter.

If unlike request was succesfull the server will return the 204 no content status with the next message:

```
{
    "detail": "Successfully unliked the post."
}
```

If the user has not previously liked the post, the server returns a 404 not found status with the next message:    

```
{
    "detail": "Not found."
}
```


## Endpoint 5: Viewing likes on a Blog Post 

Endpoint: http://127.0.0.1:8000/api/like/

Method: GET

This enpoint lists the likes of all posts to which a user has read access.
Admin users can see all likes regardless of the permissions.

If the request is successful the server returns status 200 ok with the list of likes:

```
{
    "total_count": 1,
    "current_page": 1,
    "total_pages": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "user": {
                "id": 1,
                "username": "test@gmail.com",
                "team": {
                    "id": 1,
                    "name": default
                }
            }
            "post": "Post 1"
        },
    ]
}
```

Pagination is implemented to limit the number of likes per page to 15.
Pagination include the following information: current page, total pages, total count, next page URL, previous page URL.


If a user has no likes to view an empty list is returned.

```
{
    "total_count": 0,
    "current_page": 1,
    "total_pages": 0,
    "next": null,
    "previous": null,
    "results": []
}
```

This endpoint supports filtering by the id of the user and the id of the post:

Examples:

- Endpoint: http://127.0.0.1:8000/api/like/?user=1&post=2
- Endpoint: http://127.0.0.1:8000/api/like/?user=1
- Endpoint: http://127.0.0.1:8000/api/like/?post=3


## Endpoint 6: Commenting on a Blog Post 

Endpoint: http://127.0.0.1:8000/api/comment/

Method: POST

This endpoint allows a user to comment on a post to which he has read permission.
The user must be logged in and send a POST request to the endpoint.

The request body should be a "application/json" encoded object, containing only a content field:

```
{
    "content": "Comment content"
}
```

Details of the field:

- content: cannot be an empty string or longer than 200 characters.

If the submitted field does not meet these specifications the server will not create the comment and will return a 400 badrequest status specifying the error.

```
{
    "content": [
        "This field may not be blank."
    ]
}
```

If the posts does not exist or the user has no read permission on the post the server will return a 404 not found status.

```
{
    "detail": "Not found."
}
```

If the request was successful the server returns a 201 created status with the comment created:

```
{
    "id": 1,
    "user": "request_user@gmail.com",
    "post": "Post",
    "content": "Comment content"
}
```

The delete method is used to delete the las comment made in a post.
The user must be logged in and send a DELETE request to the endpoint.

If the user has not comments it would return a 404 not found status.

```
{
    "detail": "The user has not comment this post."
}
```

If the delete was successful the server returns a 204 no content status with the next message:

```
{
    "detail": "Successfully Delete the post."
}
```


## Endpoint 7: Viewing Comments on a Blog Post

Endpoint: http://127.0.0.1:8000/api/comment/

Method: GET

This enpoint lists the comments of all posts to which a user has read access.
Admin users can see all comments regardless of the permissions.

If the request is successful the server returns status 200 ok with the list of comments:

```
{
    "total_count": 2,
    "current_page": 1,
    "total_pages": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 2,
            "user": "user_1@gmail.com",
            "post": "Post",
            "content": "Test content 2",
            "created_at": "2023-12-19T22:35:50.599652Z"
        },
        {
            "id": 1,
            "user": "user_2@gmail.com",
            "post": "Post",
            "content": "Test content 1",
            "created_at": "2023-12-19T22:35:47.644476Z"
        }
    ]
}
```
The message contains the id of the comment, the username of the user who comment and the title of the post that was commented.

Pagination is implemented to limit the number of likes per page to 10.
Pagination include the following information: current page, total pages, total count, next page URL, previous page URL.


If a user has no comments to view an empty list is returned.

```
{
    "total_count": 0,
    "current_page": 1,
    "total_pages": 0,
    "next": null,
    "previous": null,
    "results": []
}
```

This endpoint supports filtering by the username of the user and the title of the post:

Examples:

- Endpoint: http://127.0.0.1:8000/api/comment/?user=username@gmail.com&post=title
- Endpoint: http://127.0.0.1:8000/api/comment/?user=username@gmail
- Endpoint: http://127.0.0.1:8000/api/comment/?post=title


## Endpoint 8: Deleting a Blog Post

Endpoint: http://127.0.0.1:8000/api/blog/post_id/delete/

Method: DELETE

This method allows a user to delete a post if they have edit permission on the post.
Admin users can delete any post regardless of the permissions.

If the user does not have edit permission or the posts does not exist the server will return a 404 not found status.

```
{
    "detail": "Not found."
}
```

If the delete request was successful the server returns a 204 no content status with and empy message.

For more details you can enter the next url in the browser once youre insede the api: http://127.0.0.1:8000/docs/