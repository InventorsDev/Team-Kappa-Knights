from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

# class UserProfile(models.Model):
#     user_id = models.AutoField(primary_key=True)
#     username = models.CharField(max_length=150, unique=True)
#     email = models.EmailField(unique=True)
#     date_joined = models.DateTimeField(auto_now_add=True)
#     interests = models.TextField(blank=True, null=True)
#     difficuty_level = models.CharField(max_length=50, choices=[
#         ('beginner', 'Beginner'),
#         ('intermediate', 'Intermediate'),
#         ('advanced', 'Advanced')
#     ], default='beginner')

#     def __str__(self):
#         return f"{self.username} with ({self.email})"



class UserProfile(models.Model):
    user_id = models.CharField(primary_key=True)
    interests = ArrayField(models.CharField(max_length=255), blank=True, null=True, default=list)
    skills = ArrayField(models.CharField(max_length=255), blank=True, null=True, default=list)
    bio = models.TextField(blank=True, null=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'user_profiles'
        managed = False
    def __str__(self):
        return f"{self.full_name} with ({self.bio})"