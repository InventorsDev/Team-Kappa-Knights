from django.db import models

# Create your models here.

class UserProfile(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    interests = models.TextField(blank=True, null=True)
    difficuty_level = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ], default='beginner')

    def __str__(self):
        return f"{self.username} with ({self.email})"