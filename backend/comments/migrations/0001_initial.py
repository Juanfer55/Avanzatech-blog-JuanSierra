# Generated by Django 5.0.1 on 2024-02-19 13:37

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('content', models.TextField(max_length=1000, validators=[django.core.validators.MinLengthValidator(1), django.core.validators.MaxLengthValidator(1000)])),
            ],
            options={
                'verbose_name': 'Comments',
                'verbose_name_plural': 'Comments',
                'ordering': ['created_at'],
            },
        ),
    ]
