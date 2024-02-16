# Generated by Django 5.0.1 on 2024-02-16 02:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PermissionLevels',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('permission_level', models.CharField(max_length=50, unique=True, verbose_name='permission level')),
            ],
            options={
                'verbose_name': 'Permissions',
                'verbose_name_plural': 'Permissions',
                'ordering': ['pk'],
            },
        ),
    ]
