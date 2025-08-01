from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import CourseRoadmap, CourseContent
from .serializers import CourseContentSerializer
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
    


@api_view(['GET', 'POST'])
def roadmap_list(request):
    if request.method == 'GET':
        roadmaps = CourseRoadmap.objects.all()
        serializer = CourseRoadmapSerializer(roadmaps, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CourseRoadmapSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def roadmap_detail(request, pk):
    try:
        roadmap = CourseRoadmap.objects.get(pk=pk)
    except CourseRoadmap.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CourseRoadmapSerializer(roadmap)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CourseRoadmapSerializer(roadmap, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        roadmap.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET', 'POST'])
def course_content_list(request, roadmap_pk):
    try:
        roadmap = CourseRoadmap.objects.get(pk=roadmap_pk)
    except CourseRoadmap.DoesNotExist:
        return Response({"detail": "Roadmap not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        contents = CourseContent.objects.filter(roadmap=roadmap)
        serializer = CourseContentSerializer(contents, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CourseContentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(roadmap=roadmap)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    