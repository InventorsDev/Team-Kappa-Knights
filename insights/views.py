from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    PerformanceMetricsSerializer,
    SkillProgressSerializer,
    MotivationTrendSerializer,
    DailyEngagementSerializer,
    KeyInsightSerializer,
)

from django.shortcuts import get_object_or_404
from userprofile.models import UserProfile
from rest_framework import serializers
from .models import MotivationTrend



# Create your views here.
class ProgressDashboardView(APIView):
    def get(self, request, user_id):
        profile = get_object_or_404(UserProfile, pk=user_id)

        data = {
            "performance": PerformanceMetricsSerializer(getattr(profile, "performance_metrics", None)).data
                if hasattr(profile, "performance_metrics") else None,
            "skills_progress": SkillProgressSerializer(profile.skills_progress.all(), many=True).data,
            "motivation_trends": MotivationTrendSerializer(profile.motivation_trends.all(), many=True).data,
            "daily_engagement": DailyEngagementSerializer(profile.daily_engagement.all(), many=True).data,
            "key_insights": KeyInsightSerializer(profile.key_insights.all(), many=True).data,
        }

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, user_id):
        profile = get_object_or_404(UserProfile, pk=user_id)
        payload = request.data
        response_data = {}

        # Performance
        if "performance" in payload:
            perf_serializer = PerformanceMetricsSerializer(
                instance=getattr(profile, "performance_metrics", None),
                data=payload["performance"],
                partial=True
            )
            if perf_serializer.is_valid():
                perf_serializer.save(user_profile=profile)
                response_data["performance"] = perf_serializer.data

        # Skills Progress
        if "skills_progress" in payload:
            for skill in payload["skills_progress"]:
                serializer = SkillProgressSerializer(data=skill)
                if serializer.is_valid():
                    serializer.save(user_profile=profile)
            response_data["skills_progress"] = SkillProgressSerializer(profile.skills_progress.all(), many=True).data

        # Motivation Trends
        if "motivation_trends" in payload:
            for trend in payload["motivation_trends"]:
                serializer = MotivationTrendSerializer(data=trend)
                if serializer.is_valid():
                    MotivationTrend.objects.update_or_create(
                        user_profile=profile,
                        week_number=trend["week_number"],
                        defaults={"score": trend["score"]}
                    )
            response_data["motivation_trends"] = MotivationTrendSerializer(
                profile.motivation_trends.all(), many=True
            ).data

        # Daily Engagement
        if "daily_engagement" in payload:
            for entry in payload["daily_engagement"]:
                serializer = DailyEngagementSerializer(data=entry)
                if serializer.is_valid():
                    serializer.save(user_profile=profile)
            response_data["daily_engagement"] = DailyEngagementSerializer(profile.daily_engagement.all(), many=True).data

        # Key Insights
        if "key_insights" in payload:
            for insight in payload["key_insights"]:
                serializer = KeyInsightSerializer(data=insight)
                if serializer.is_valid():
                    serializer.save(user_profile=profile)
            response_data["key_insights"] = KeyInsightSerializer(profile.key_insights.all(), many=True).data

        return Response(response_data, status=status.HTTP_200_OK)