## Blog avanzatech API Documentation

This is the documentation of the Blog avanzatech API created by Juan Fernando Sierra. This API contains endpoints to create, modify, delete, list, like and comment blog posts.


The project is composed of 10 modules that contain different functionalities:


- avanzatech_blog: It is the main module, it contains the configuration files of the djando project and the main root of the urls.

- api: Contains the url addresses of the api.

- shared: Contains utilities used in the project, reducing code repetition.

- users: Contains the custom user model with views for login, register and logout.

- posts: Contains the posts model, serializers and views.

- permissions: Contains the permission levels model.

- Categories: Contains the different categories for the post permissions. 

- postCategory: Contains the post permission for each category.

- comments: Contains the comments, serializers and views model.

- likes: Contains the likes, serializers and views model.

- testing_utilities: Contains factories and utilities to configure the testing environments.


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

Method: POST

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

## Endpoint  4.1: Unlike a blog post

Endpoint: http://127.0.0.1:8000/api/like/like_id

Method: DELETE

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
            "post": 1
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

The request body should be a "application/json" encoded object, containing the next fields:

```
{
    "content": "Comment content",
    "post": 1
}
```

Details of the fields:

- content: cannot be an empty string or longer than 200 characters.
- post: Must be the id of an existing post in the database, to which the user has read permission.

If the fields does not meet these specifications the server will not create the comment and will return a 400 badrequest status specifying the error.

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
    "user": {
        "id": 1,
        "username": "test@gmail.com",
        "team": {
            "id": 1,
            "name": "test@gmail.com"
        }
    }
    "post": 1,
    "content": "Comment content"
}
```

## Endpoint 6.1: Remove a comment from a post.

Endpoint: http://127.0.0.1:8000/api/comment/comment_id

Method: DELETE

This endpoint allows a user to delete comments on a post to which he has read permission.
The user must be logged in and send a DELETE request to the endpoint.

If the comment not exist or not belong to the user, the server would return a 404 not found status.

```
{
    "detail": "Not found."
}
```

If the delete was successful the server returns a 204 no content status.

## Endpoint 7: Viewing Comments on a Blog Post

Endpoint: http://127.0.0.1:8000/api/comment/

Method: GET

This enpoint lists the comments of all posts to which a user has read access.
Admin users can see all comments regardless of the permissions.

If the request is successful the server returns status 200 ok with the list of comments:

```
{
    "total_count": 1,
    "current_page": 1,
    "total_pages": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 2,
            "user": {
                "id": 1,
                "username": "test@gmail.com",
                "team": {
                    "id": 1,
                    "name": "test@gmail.com"
                }
            },
            "post": 1,
            "content": "Test content 2",
            "created_at": "2023-12-19T22:35:50.599652Z"
        },
    ]
}
```
The message contains the id of the comment, the information of the user who comment, the id of the post that was commented and the timestamp.

Pagination is implemented to limit the number of comments per page to 5.
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

This endpoint supports filtering by the id of the user and the id of the post:

Examples:

- Endpoint: http://127.0.0.1:8000/api/comment/?user=1&post=2
- Endpoint: http://127.0.0.1:8000/api/comment/?user=1
- Endpoint: http://127.0.0.1:8000/api/comment/?post=2


## Endpoint 8: Deleting a Blog Post

Endpoint: http://127.0.0.1:8000/api/blog/post_id/

Method: DELETE

This endpoint allows a user to delete a post if they have edit permission on the post.
Admin users can delete any post regardless of the permissions.

If the user does not have edit permission or the posts does not exist the server will return a 404 not found status.

```
{
    "detail": "Not found."
}
```

If the delete request was successful the server returns a 204 no content status with and empy message.

## Endpoint 9: Login

Endpoint: http://127.0.0.1:8000/api/auth/login

Method: POST

This endpoint allows users to log in and set session cookies in the browser.

The request body should be a "application/json" encoded object, containing the next fields:

```
{
    "username": "test@gmail.com",
    "password": "test123456"
}
```

Details of the fields:

- username: text with email formatting.
- password: text of at least eight characters in length.

Both fields must represent a valid user in the data base.

If the login is successful, the server will return a status 200 ok and the next message:

```
{
    "success": "Successful login"
}
```

If the user does not exist or the credentials provided are invalid, the server will return a 400 bad request status with the following message:

```
{
    "error": "Incorrect username or password"
}
```

## Endpoint 10: Register

Endpoint: http://127.0.0.1:8000/api/auth/register

Method: POST

This endpoint allows users to create a profile to log into the application.

The request body should be a "application/json" encoded object, containing the next fields:

```
{
    "username": "test@gmail.com",
    "password": "test123456"
}
```

Details of the fields:

- username: text with email formatting.
- password: text of at least eight characters in length, it cannot not be all numeric.

If the register is successful, the server will return a status 200 ok and the next message:

```
{
    "success": "Successfully registered"
}
```

If the fields does not meet these specifications the server will not create the new user and will return a 400 badrequest status specifying the error.

```
{
    "error": {
        "username": [
            "Enter a valid email address."
        ]
    }
}
```

## Endpoint 11: Get user profile

Endpoint: http://127.0.0.1:8000/api/auth/user

Method: GET

This endpoint allows a user to access his or her profile data. 
The user must be login and have the session cookies in the browser in order to get his or her profile data. 

If the get profile was successful, the server will return a 200 ok status and the next message:

```
{
    "id": 2,
    "username": "user1@gmail.com",
    "team": {
        "name": "Default"
    },
    "is_admin": false
}
```

If the user is not login, the server will return a 401 Unauthorized status and the next message:

```
{
    "error": "Authentication credentials were not provided"
}
```

## Endpoint 12: Validate Email

Endpoint: http://127.0.0.1:8000/api/auth/validate-username/

Method: GET

This endpoint allows a user to know if his email is valid or has already been registered on the page.

The request body should be a "application/json" encoded object, containing the next field:

```
{
    "username": "test@gmail.com"
}
```

If the username is available, the server will return a 200 ok status and the next message: 

```
{
    "IsAvailable": true
}
```

If the user name is not available, the server will return a 200 ok status and the next message:

```
{
    "IsAvailable": false
}
```

## Endpoint 13: Logout

Endpoint: http://127.0.0.1:8000/api/auth/logout

Method: GET

This endpoint allows the user to log out of the application and clear the browser's session cookies.
The user must be login and have the session cookies in the browser in order to logout.

If the get logout was successful, the server will return a 200 ok status and the next message:

```
{
    "success": "Successfully logged out"
}
```

If the user was not login previously, the server will return a 401 badrequest status and the next message:

```
{
"error": "Authentication credentials were not provided"
}
```