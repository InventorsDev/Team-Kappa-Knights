from django.contrib import admin
from .models import Courses, CourseEnrollment, CourseRoadmap, CourseContent, Tag


# Register your models here.
admin.site.register(Courses)
admin.site.register(CourseRoadmap)
admin.site.register(CourseEnrollment)
admin.site.register(CourseContent)
admin.site.register(Tag)