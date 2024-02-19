# Generated by Django 5.0.1 on 2024-02-18 20:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('categories', '0001_initial'),
        ('permissions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='categories.categories')),
                ('permission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='permissions.permissionlevels')),
            ],
            options={
                'verbose_name': 'Post Category',
                'verbose_name_plural': 'Post Category',
                'ordering': ['pk'],
            },
        ),
    ]
