"""Constants for the project"""

class Category():
    """
    Constants for the permission category of the post.
    """
    PUBLIC = 1
    AUTHENTICATED = 2
    TEAM = 3
    AUTHOR = 4

class Permission():
    """
    Constants for the permission of the post.
    """
    NONE = 1
    READ_ONLY = 2
    READ_AND_EDIT = 3
