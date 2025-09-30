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
        fields = '__all__'
        read_only_fields = ['course_id', 'created_at', 'updated_at']

    def get_levels(self, obj):
        from .models import CourseContent  
        return CourseContent.objects.filter(roadmap__course=obj).count()


class RecommendationInputSerializer(serializers.Serializer):   
    skill_level = serializers.ChoiceField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')], allow_blank=True, required=False)
    interests = serializers.ListField(child=serializers.CharField(), allow_empty=True, required=False)
    #course_type = serializers.ChoiceField(choices=Courses._meta.get_field('course_type').choices)

# Input validation serializer for course search
class CourseSearchInputSerializer(serializers.Serializer):
    interest = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=True,
        help_text="List of interests to look for in course title, description, and tags"
    )
    skill_level = serializers.ChoiceField(
        choices=[('beginner', 'Beginner'),
                 ('intermediate', 'Intermediate'),
                 ('advanced', 'Advanced')],
        required=False,
        help_text="Filter by difficulty level"
    )


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    course = CoursesSerializers(read_only=True)  # for GET responses
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Courses.objects.all(),
        source="course",
        write_only=True
    )

    class Meta:
        model = CourseEnrollment
        fields = [
            'enrollment',
            'user',
            'course',       # detailed course info in response
            'course_id',    # accepts course id in POST
            'enrolled_at',
            'completed',
            'progress'
        ]


class ExternalCourseSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
    title = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False)
    course_url = serializers.URLField()
    difficulty = serializers.CharField()
    rating = serializers.DecimalField(max_digits=3, decimal_places=2, required=False)
    progress = serializers.FloatField(required=False)
    duration = serializers.CharField(required=False, allow_blank=True)
    tutor_academy = serializers.CharField(required=False, allow_blank=True)
    overview = serializers.CharField(required=False, allow_blank=True)