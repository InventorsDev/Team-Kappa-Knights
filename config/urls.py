
from django.contrib import admin
from django.urls import path

from base.views import course_list, course_roadmap

urlpatterns = [
    path('admin/', admin.site.urls),
    path('courses/', course_list, name='course-list'),
    path('courses/<int:pk>/<int:roadmap_id>/', course_roadmap, name='course-roadmap'),

]
