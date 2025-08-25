from django.urls import path
from .views import RecommendCoursesView

urlpatterns = [
    path("outrecommend/", RecommendCoursesView.as_view(), name="recommend_courses"),
]
