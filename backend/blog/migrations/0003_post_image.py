# Generated by Django 5.0.3 on 2024-03-25 01:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0002_auto_20200914_1537"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="post_images/"),
        ),
    ]
