# Generated by Django 5.0.1 on 2024-02-13 12:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('postCategory', '0001_initial'),
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='postcategory',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.posts'),
        ),
    ]
