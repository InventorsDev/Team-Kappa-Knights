from django.shortcuts import render

# Create your views here.


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services.youtube_service import search_youtube_courses
from .logic.ranker import rank_courses
from .services.nuroki_agent import Nuroki

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
        
#         recommendations = Nuroki.recommend_courses(Nuroki.self,
#         tags=tags, 
#         difficulty=difficulty
#     )
#         return Response({
#             "status": "success",
#             "recommendations": recommendations,
#             "meta": {"count": len(recommendations), "sources": ["YouTube", "Coursera", "edX"]}
#         })
    

class RecommendAllCoursesView(APIView):
    def post(self, request):
        try:
            tags = request.data.get("tags", [])
            difficulty = request.data.get("difficulty", "beginner").lower()

            if not tags or not isinstance(tags, list):
                return Response({"error": "Tags must be provided as a list"}, status=status.HTTP_400_BAD_REQUEST)
            if not difficulty or not isinstance(difficulty, str):
                return Response({"error": "Difficulty must be provided as a string"}, status=status.HTTP_400_BAD_REQUEST)

            nuroki = Nuroki()
            recommendations = nuroki.recommend_courses(tags, difficulty)

            return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)