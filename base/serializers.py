from rest_framework import serializers

from .models import Courses, CourseEnrollment, CourseRoadmap, CourseContent

class CoursesSerializers(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['course_id', 'course_type', 'course_name', 'description']
        read_only_fields = ['course_id']

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = ['enrollment_id', 'user_id', 'course_id', 'enrolled_at']
        read_only_fields = ['enrollment_id', 'enrolled_at']

class CourseRoadmapSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseRoadmap
        fields = '__all__'
        read_only_fields = ['roadmap_id']

class CourseContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContent
        fields = '__all__'