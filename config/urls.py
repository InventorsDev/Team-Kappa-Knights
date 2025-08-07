
from django.contrib import admin
from django.urls import path

from base.views import course_list, roadmap_list, roadmap_detail, course_content_list, recommend_courses

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Nuroki API",
      default_version='v1',
      description="API documentation",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('courses/', course_list, name='course-list'),
    path('roadmaps/', roadmap_list, name='roadmap-list'),
    path('roadmaps/<int:pk>/', roadmap_detail, name='roadmap-detail'),
    path('roadmaps/<int:roadmap_pk>/contents/', course_content_list, name='roadmap-contents'),
    path('recommend/', recommend_courses, name='recommend_courses'),

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
