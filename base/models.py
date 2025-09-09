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
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    #course_type = models.CharField(choices=COURSES_TYPE, max_length=50, null=True, default='')
    title = models.CharField(max_length=200, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    course_url = models.URLField(blank=False, default='')
    difficulty = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ], default='beginner')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    tags = models.ManyToManyField(Tag)
    progress = models.FloatField(default=0.0)  # New field to track progress percentage

    def __str__(self):
        return self.title
    


# class CourseEnrollment(models.Model):
#     user = models.ForeignKey('userprofile.UserProfile', on_delete=models.CASCADE)
#     course = models.ForeignKey(Courses, on_delete=models.CASCADE)
#     enrolled_at = models.DateTimeField(auto_now_add=True)
#     completed = models.BooleanField(default=False)

#     class Meta:
#         unique_together = ('user', 'course')

#     def __str__(self):
#         return f"{self.user.full_name} enrolled in {self.course.course_name}"


class CourseEnrollment(models.Model):
    enrollment = models.AutoField(primary_key=True)
    user = models.ForeignKey('userprofile.UserProfile', on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE, to_field='course_id')  # Add to_field parameter
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('user', 'course')
    
    def __str__(self):
        return f"{self.user.full_name} enrolled in {self.course.title}"  # Adjust field name as needed
    

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
    sequence = models.IntegerField(default=1)
    content_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(choices=[
        ('completed', 'Completed'),
        ('in-progress', 'In-progress'),
        ('not-started', 'Not-started')
    ], default='not-started')

    def __str__(self):
        return f"{self.title} ({self.sequence})"



# class Onboarding(models.Model):
#     user = models.OneToOneField('userprofile.UserProfile', on_delete=models.CASCADE, primary_key=True)
#     completed = models.BooleanField(default=False)

#     def __str__(self):
#         return f"Onboarding status for {self.user.full_name or self.user.email}"
