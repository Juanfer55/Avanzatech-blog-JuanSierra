# Generated by Django 5.0.1 on 2024-02-14 16:22

import django.contrib.auth.password_validation
import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('teams', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('username', models.EmailField(max_length=120, unique=True, validators=[django.core.validators.EmailValidator()], verbose_name='username')),
                ('password', models.CharField(max_length=120, validators=[django.contrib.auth.password_validation.validate_password], verbose_name='password')),
                ('is_admin', models.BooleanField(default=False, verbose_name='is admin')),
                ('is_staff', models.BooleanField(default=False, verbose_name='is staff')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('team', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='teams.teams')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
                'ordering': ['id'],
            },
        ),
    ]
