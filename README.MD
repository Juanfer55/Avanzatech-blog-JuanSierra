## Blog avanzatech!

Welcome to the avanzatech blog web application. Here you will be able to create, read, like and comment on blog entries
made by avanzatech students.

To install and run the project on your machine you must clone the repository on your computer:

```
$ git clone git@github.com:Juanfer55/Avanzatech-blog-JuanSierra.git
```

Then you must configure the backend and frontend of the application.

# Set up the backend

1. Enter to the backend directory:

```
$ cd backend
```

2. Verify that you have pipenv installed, otherwise install it:

```
$ pip install pipenv

$ python3 -m pip install --upgrade pipenv
```

3. Install the project dependencies and activate the virtual environment created by pipenv:

```
$ pipenv --python <path/to/python> install

$ pipenv install
```

For more details on how to install pipenv and create a virtual environment, check the following link: https://pipenv-es.readthedocs.io/es/latest/

4. Perform the project migrations:

-- Inside your virtual environment run the following commands:
```
$ python manage.py makemigrations

$ python manage.py migrate
```

5. Populate the database with default information:

-- Inside your virtual environment run the following commands:
```
$ python manage.py shell <  python manage.py shell < create_default_data.py
```

This would do the following:

- Creates a default team: Default.
- Creates default permission levels: None, Read-only and Read-and-edit.
- Creates default categories: Public, authenticated, team and author.
- Creates 3 adicional teams: Bravo, Alpha and Charlie.
- Creates 10 users for each team:
    The usernames for the users are the team name follow by a number between 1 and 10: 
        bravo1@gmail.com... bravo10@gmail.com, alpha1@gmail.com... alpha10@gmail.com, charlie1@gmail.com... charlie10@gmail.com
    The password for all the users is: test123456
    There are 30 users in total, and you can log into the platform using the one you want to test the web application in different scenarios.
- Create 5 admin users:
    The usernames for the admin users are admin follow by a number between 1 and 5:
        admin1@gmail.com... admin5@gmail.com
    The password for all the admin users is: test123456
    You can log into the platform using the one you want to test the web application in different scenarios.
- Create a super user:
    username: super@gmail.com
    password: test123456
    With the superuser you can access the django administration site and make the modifications you need.
- Create a post for each user:
    The post will have a default content and title.
    The post will be like for the first 20 users.
    The post will have a default comment made by the author of the pots.

6. Run test:

-- Inside your virtual environment run the following command:
```
$ python manage.py test
```

This command will run all unittests and show the results.

7. Start the server:

-- Inside your virtual environment run the following command:
```
python manage.py runserver 8000
```


8. Go to the admin panel and login with the superuser credentials created in the previous step.

Endpoint = http://127.0.0.1:8000/admin/

There you will have access to the project administration panel. In the administration site you will be able to create, modify and delete users; create, modify, delete, list, like and comment blog posts.

# Set up the frontend

1. Enter to the frontend directory:

```
$ cd frontend
```

2. Install all required dependencies:

-Important: You mus have install npm and the angular client.

```
$ npm i
```

3. Run tests:

```
$ ng test --no-watch --code-coverage --browsers=ChromeHeadless
```

4. Run the frontend server

```
$ ng serve
```