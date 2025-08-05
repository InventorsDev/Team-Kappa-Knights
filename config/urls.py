
from django.contrib import admin
from django.urls import path

from base.views import course_list, roadmap_list, roadmap_detail, course_content_list, recommend_courses

urlpatterns = [
    path('admin/', admin.site.urls),
    path('courses/', course_list, name='course-list'),
    path('roadmaps/', roadmap_list, name='roadmap-list'),
    path('roadmaps/<int:pk>/', roadmap_detail, name='roadmap-detail'),
    path('roadmaps/<int:roadmap_pk>/contents/', course_content_list, name='roadmap-contents'),
    path('recommend/', recommend_courses, name='recommend_courses'),
]
