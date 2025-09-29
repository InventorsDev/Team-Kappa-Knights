from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Courses, Tag
from .serializers import RecommendationInputSerializer
from .serializers import CoursesSerializers, CourseEnrollmentSerializer, CourseRoadmapSerializer, CourseContentSerializer
from django.db.models import Q, Count
from difflib import SequenceMatcher
from .models import UserCourseContent
from django.utils import timezone



from .models import Courses, CourseEnrollment, CourseRoadmap, CourseContent

@api_view(['GET', 'POST'])
def course_list(request):
    if request.method == 'GET':
        courses = Courses.objects.all()
        serializer = CoursesSerializers(courses, many=True)
        return Response(serializer.data, status=200)
    elif request.method == 'POST':
        serializer = CoursesSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


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

    



# @api_view(['POST'])
# def recommend_courses(request):
#     serializer = RecommendationInputSerializer(data=request.data)

#     if serializer.is_valid():
#         skill_level = serializer.validated_data['skill_level']
#         #course_type = serializer.validated_data['course_type']
#         interests = [i.lower().strip() for i in serializer.validated_data['interests']]

#         from django.db.models.functions import Lower
#         tags = Tag.objects.annotate(lower_name=Lower('name')).filter(lower_name__in=interests)

#         print("Matching tags:", list(tags.values_list("name", flat=True)))

#         courses = Courses.objects.filter(
#             difficulty=skill_level,
#             #course_type=course_type,
#             tags__in=tags
#         ).distinct().order_by('-rating')

#         print("Matched courses:", courses.count())

#         return Response(CoursesSerializers(courses, many=True).data)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from .serializers import CoursesSerializers, RecommendationInputSerializer

@api_view(['POST'])
def recommend_courses(request):
    """
    Recommend courses based on optional skill level and required interests (tags)

    Example request body:
    {
        "skill_level": "beginner",       # optional
        "interests": ["Machine Learning", "Python"]   # required, non-empty list
    }
    """
    try:
        # Validate input using serializer
        input_serializer = RecommendationInputSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response({
                'error': 'Invalid input data',
                'details': input_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        # Extract validated data
        validated_data = input_serializer.validated_data
        skill_level = validated_data.get('skill_level') or "beginner"   # now optional
        interests = validated_data['interests']

        # Start with all courses
        courses_query = Courses.objects.all()

        # Filter by skill level only if provided
        if skill_level:
            courses_query = courses_query.filter(difficulty=skill_level)

        # Filter by interests (tags)
        tag_query = Q()
        for interest in interests:
            tag_query |= Q(tags__name__icontains=interest.strip())

        courses_query = courses_query.filter(tag_query).distinct()

        # Annotate with matching tag count for better ranking
        courses_query = courses_query.annotate(
            matching_tags_count=Count('tags', filter=tag_query)
        ).order_by('-matching_tags_count', '-rating', '-created_at')

        # Limit results to top 10
        recommended_courses = courses_query[:10]

        # Serialize the courses
        output_serializer = CoursesSerializers(recommended_courses, many=True)

        # Prepare response
        response_data = {
            'recommendations': output_serializer.data,
            'total_found': len(output_serializer.data),
            'filters_applied': {
                'skill_level': skill_level if skill_level else "not specified",
                'interests': interests
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': 'An error occurred while processing your request',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from .serializers import CoursesSerializers, CourseSearchInputSerializer

@api_view(['POST'])
def search_courses(request):
    """
    Search courses based on query string with flexible matching
    
    Expected input:
    {
        "query": "python machine learning",  # Required: search term
        "skill_level": "beginner"            # Optional: filter by skill level
    }
    
    Search logic:
    - Searches in course titles and descriptions (case-insensitive, partial matching)
    - Also searches in associated tag names (case-insensitive, partial matching)
    - Returns distinct results ordered by rating (descending)
    """
    try:
        # Validate input using serializer
        input_serializer = CourseSearchInputSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response({
                'error': 'Invalid input data',
                'details': input_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract validated data
        validated_data = input_serializer.validated_data
        query = validated_data.get('query', '').strip()
        skill_level = validated_data.get('skill_level')
        
        # Start building the query
        courses_query = Courses.objects.all()
        
        # Apply skill level filter if provided
        if skill_level:
            courses_query = courses_query.filter(difficulty=skill_level)
        
        # Apply search query if provided
        if query:
            # Create comprehensive search across title, description, and tags
            search_query = (
                Q(title__icontains=query) |           # Search in title
                Q(description__icontains=query) |     # Search in description  
                Q(tags__name__icontains=query)        # Search in tag names
            )
            courses_query = courses_query.filter(search_query)
        
        # Make results distinct and order by rating descending, then by creation date
        courses_query = courses_query.distinct().order_by('-rating', '-created_at')
        
        # Execute query
        found_courses = courses_query
        
        # Serialize the results
        serializer = CoursesSerializers(found_courses, many=True)
        
        # Prepare response
        response_data = {
            'courses': serializer.data,
            'total_found': len(serializer.data),
            'search_info': {
                'query': query,
                'skill_level': skill_level,
                'searched_fields': ['title', 'description', 'tags']
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'An error occurred while searching courses',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET', 'POST'])
def enrollment(request):
    """
    Handle course enrollments (create and list enrollments)

    Expected input (POST):
    {
        "user_id": 1,       # Required: ID of the user enrolling
        "course_id": 5      # Required: ID of the course to enroll in
    }

    Behavior:
    - GET: Returns a list of all enrollments with user and course details
    - POST: Creates a new enrollment if valid data is provided

    Validation:
    - Ensures that user_id and course_id exist in the database
    - Prevents invalid or incomplete data from being saved

    Responses:
    - 201 Created: Enrollment successfully created
    - 400 Bad Request: Invalid data (e.g., missing or incorrect fields)
    - 200 OK: List of all enrollments when using GET
    - 405 Method Not Allowed: For unsupported HTTP methods
    """


    if request.method == 'POST':
        serializer = CourseEnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'GET':
        enrollments = CourseEnrollment.objects.all()
        serializer = CourseEnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)





# for progress update
from userprofile.models import UserProfile
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

def update_course_progress(user_id, course):
    try:
        user = UserProfile.objects.get(pk=user_id)
    except UserProfile.DoesNotExist:
        return 0  # if user doesn't exist, just return 0

    total_contents = CourseContent.objects.filter(roadmap__course=course).count()
    completed_contents = UserCourseContent.objects.filter(
        user_id=user_id, content__roadmap__course=course, completed=True
    ).count()

    if total_contents > 0:
        percentage = (completed_contents / total_contents) * 100
    else:
        percentage = 0

    enrollment, created = CourseEnrollment.objects.get_or_create(user=user, course=course)
    enrollment.progress = percentage
    enrollment.completed = (percentage == 100)
    enrollment.save()

    return percentage


@api_view(['POST'])
def complete_content(request, content_id):
    user_id = request.data.get("user_id")   # get user from request body
    if not user_id:
        return Response({"error": "user_id required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = UserProfile.objects.get(pk=user_id)
    except UserProfile.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        content = CourseContent.objects.get(pk=content_id)
    except CourseContent.DoesNotExist:
        return Response({"error": "Content not found"}, status=status.HTTP_404_NOT_FOUND)

    # Mark content as completed
    ucc, created = UserCourseContent.objects.get_or_create(user=user, content=content)
    ucc.completed = True
    ucc.completed_at = timezone.now()
    ucc.save()

    # Update course progress (pass user.id instead of user)
    progress = update_course_progress(user.user_id, content.roadmap.course)

    return Response({"message": "Content completed", "progress": progress})
