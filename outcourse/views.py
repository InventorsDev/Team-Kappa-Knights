from django.shortcuts import render

# Create your views here.


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services.youtube_service import search_youtube_courses
from .logic.ranker import rank_courses

class RecommendCoursesView(APIView):
    def post(self, request):
        tags = request.data.get("tags", [])
        difficulty = request.data.get("difficulty", "beginner").lower()
        
        if not tags:
            return Response({"error": "Tags are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch from YouTube (can add Coursera, edX later)
        yt_courses = search_youtube_courses(tags, difficulty, max_results=20)
        
        # Rank them
        ranked = rank_courses(yt_courses, tags)
        
        return Response({
            "status": "success",
            "query": {"tags": tags, "difficulty": difficulty},
            "recommendations": ranked,
            "meta": {"count": len(ranked), "sources": ["YouTube"]}
        })
