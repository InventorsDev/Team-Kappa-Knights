from django.shortcuts import render

# Create your views here.


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services.nuroki_agent import Nuroki

from base.serializers import CoursesSerializers, ExternalCourseSerializer
from django.db.models import Q
from base.models import Courses

from base.serializers import CourseSearchInputSerializer

# class RecommendCoursesView(APIView):
#     def post(self, request):
#         tags = request.data.get("tags", [])
#         difficulty = request.data.get("difficulty", "beginner").lower()
        
#         if not tags:
#             return Response({"error": "Tags are required"}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Fetch from YouTube (can add Coursera, edX later)
#         yt_courses = search_youtube_courses(tags, difficulty, max_results=20)
        
#         # Rank them
#         ranked = rank_courses(yt_courses, tags)
        
#         return Response({
#             "status": "success",
#             "query": {"tags": tags, "difficulty": difficulty},
#             "recommendations": ranked,
#             "meta": {"count": len(ranked), "sources": ["YouTube"]}
#         })


# class RecommendAllCoursesView(APIView):
#     def post(self, request):
#         # This is a placeholder for a more complex recommendation logic
#         tags = request.data.get("tags", [])
#         difficulty = request.data.get("difficulty", "beginner").lower()
#         if not tags:
#             return Response({"error": "Tags are required"}, status=status.HTTP_400_BAD_REQUEST)
        
#         recommendations = Nuroki.recommend_courses_m(Nuroki.self,
#         tags=tags, 
#         difficulty=difficulty
#     )
#         return Response({
#             "status": "success",
#             "recommendations": recommendations,
#             "meta": {"count": len(recommendations), "sources": ["YouTube", "Coursera", "edX"]}
#         })
    

# class RecommendAllCoursesView(APIView):
#     def post(self, request):
#         try:
#             tags = request.data.get("tags", [])
#             difficulty = request.data.get("difficulty", "beginner").lower()

#             if not tags or not isinstance(tags, list):
#                 return Response({"error": "Tags must be provided as a list"}, status=status.HTTP_400_BAD_REQUEST)
#             if not difficulty or not isinstance(difficulty, str):
#                 return Response({"error": "Difficulty must be provided as a string"}, status=status.HTTP_400_BAD_REQUEST)

#             nuroki = Nuroki()
#             recommendations = nuroki.recommend_courses(tags, difficulty)

#             return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)









class RecommendAllCoursesView(APIView):
    """
    POST:
    {
        "interest": ["python", "machine learning"],   # required list of interests
        "skill_level": "beginner"                     # optional difficulty filter
    }

    Logic:
    1. Search database courses by interests/skill_level.
    2. If <4 results → fetch external recommendations and merge.
    3. If >=4 results → return DB results only.
    """

    def post(self, request):
        try:
            # Step 1 – Validate input
            input_serializer = CourseSearchInputSerializer(data=request.data)
            if not input_serializer.is_valid():
                return Response(
                    {
                        "error": "Invalid input data",
                        "details": input_serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            validated = input_serializer.validated_data
            interests = [i.strip() for i in validated.get("interest", []) if i.strip()]
            skill_level = validated.get("skill_level")

            # Step 2 – Build database query
            courses_qs = Courses.objects.all()
            if skill_level:
                courses_qs = courses_qs.filter(difficulty=skill_level)

            if interests:
                search_filter = Q()
                for word in interests:
                    search_filter |= (
                        Q(title__icontains=word) |
                        Q(description__icontains=word) |
                        Q(tags__name__icontains=word)
                    )
                courses_qs = courses_qs.filter(search_filter)

            db_courses = (
                courses_qs.distinct()
                .order_by("-rating", "-created_at")
            )

            # Step 3 – Serialize DB results
            db_serialized = CoursesSerializers(db_courses, many=True).data
            recommendations = list(db_serialized)

            # Step 4 – If fewer than 4 results, fetch external
            if len(db_serialized) < 4:
                service = Nuroki()
                external_courses = service.recommend_courses_m(
                    tags=interests,
                    difficulty=skill_level or "beginner"
                )

                ext_serializer = ExternalCourseSerializer(
                    data=external_courses, many=True
                )
                ext_serializer.is_valid(raise_exception=True)

                recommendations.extend(ext_serializer.data)

            # Step 5 – Build final response
            return Response(
                {
                    "courses": recommendations,
                    "total_returned": len(recommendations),
                    "search_info": {
                        "interest": interests,
                        "skill_level": skill_level,
                        "searched_fields": ["title", "description", "tags"]
                    }
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {
                    "error": "An error occurred while processing the request",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )