from django.db import models

COURSES_TYPE = {
    'frontend': 'Frontend Development',
    'backend': 'Backend Development',
    'data_science': 'Data Science',
    'mobile': 'Mobile Development',
    'product_management': 'Product Management',
    'ui_ux': 'UI/UX Design',
    'devops': 'DevOps',
}


# Create your models here.
class Tag(models.Model):
    tag_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    course_type = models.CharField(choices=COURSES_TYPE, max_length=50)
    title = models.CharField(max_length=200, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    course_url = models.URLField(blank=False, default='')
    difficulty = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ], default='beginner')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.title
    

class CourseEnrollment(models.Model):
    enrollment_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('userprofile.UserProfile', on_delete=models.CASCADE)
    course_id = models.ForeignKey(Courses, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_id', 'course_id')

    def __str__(self):
        return f"{self.user_id.username} enrolled in {self.course_id.course_name}"
    

class CourseRoadmap(models.Model):
    course = models.OneToOneField(Courses, on_delete=models.CASCADE, primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} for {self.course.title}"

    
class CourseContent(models.Model):
    content_id = models.AutoField(primary_key=True)
    roadmap = models.ForeignKey(CourseRoadmap, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content_type = models.CharField(max_length=50)  # e.g., 'video', 'article', 'quiz'
    content_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    done = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.content_type})"



