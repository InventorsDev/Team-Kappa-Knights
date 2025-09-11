from rest_framework import serializers

from .models import Courses, CourseEnrollment, CourseRoadmap, CourseContent, Tag



class CourseRoadmapSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseRoadmap
        fields = '__all__'
        read_only_fields = ['roadmap_id', 'created_at', 'updated_at']

class CourseContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContent
        fields = '__all__'



class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tag_id', 'name']

class CoursesSerializers(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    levels = serializers.SerializerMethodField()

    class Meta:
        model = Courses
        fields = [
            'course_id',
            'title', 
            'description',
            'created_at',
            'updated_at',
            'course_url',
            'difficulty',
            'rating',
            'tags',
            'progress',
            'duration',
            'tutor_academy',
            'levels',
            'overview',
        ]
        read_only_fields = ['course_id', 'created_at', 'updated_at']

    def get_levels(self, obj):
        from .models import CourseContent  
        return CourseContent.objects.filter(roadmap__course=obj).count()


class RecommendationInputSerializer(serializers.Serializer):   
    skill_level = serializers.ChoiceField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')])
    interests = serializers.ListField(child=serializers.CharField(), allow_empty=False)
    #course_type = serializers.ChoiceField(choices=Courses._meta.get_field('course_type').choices)

# Input validation serializer for course search
class CourseSearchInputSerializer(serializers.Serializer):
    query = serializers.CharField(
        max_length=500,
        required=True,
        help_text="Search term to look for in course title, description, and tags"
    )
    skill_level = serializers.ChoiceField(
        choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')],
        required=False,
        help_text="Filter by difficulty level"
    )


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    course = CoursesSerializers(read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = ['enrollment', 'user', 'course', 'enrolled_at', 'completed', 'progress']