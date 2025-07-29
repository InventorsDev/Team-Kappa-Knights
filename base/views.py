from django.shortcuts import render
from rest_framework.response import Response

# Create your views here.

from .serializers import CoursesSerializers, CourseEnrollmentSerializer, CourseRoadmapSerializer, CourseContentSerializer
from rest_framework.decorators import api_view

from .models import Courses, CourseEnrollment, CourseRoadmap, CourseContent

@api_view(['GET'])
def course_list(request):
    if request.method == 'GET':
        courses = Courses.objects.all()
        serializer = CoursesSerializers(courses, many=True)
        return Response(serializer.data, status=200)
    
@api_view(['GET'])
def course_roadmap(request, pk, roadmap_id):
    try:
        course = Courses.objects.get(pk=pk)
        roadmap = CourseRoadmap.objects.get(pk=roadmap_id, course_id=pk)

        contents = CourseContent.objects.filter(roadmap_id=roadmap_id)
    except Courses.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)
    except CourseRoadmap.DoesNotExist:
        return Response({'error': 'Roadmap not found for this course'}, status=404)

    if request.method == 'GET':
        serializer = CourseContentSerializer(contents, many=True)
        return Response(serializer.data, status=200)
    
    