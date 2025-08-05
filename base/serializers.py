from rest_framework import serializers

from .models import Courses, CourseEnrollment, CourseRoadmap, CourseContent

class CoursesSerializers(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['course_id', 'title', 'description', 'course_type',  'description', 'difficulty', 'rating']
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

from base.models import Courses

class RecommendationInputSerializer(serializers.Serializer):   
    skill_level = serializers.ChoiceField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')])
    interests = serializers.ListField(child=serializers.CharField(), allow_empty=False)
    course_type = serializers.ChoiceField(choices=Courses._meta.get_field('course_type').choices)
