from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import (
     PerformanceMetrics, SkillProgress,
    MotivationTrend, DailyEngagement, KeyInsight
)




# ------------------- Serializers -------------------

class PerformanceMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceMetrics
        fields = ["skills_completed", "active_days", "hours_studied", "motivation_level"]


class SkillProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillProgress
        fields = ["skill_name", "completion_percent"]


class MotivationTrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotivationTrend
        fields = ["week_number", "score"]


class DailyEngagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyEngagement
        fields = ["day_of_week", "hours"]


class KeyInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyInsight
        fields = ["category", "message"]


# Bundle serializer for GET
class ProgressDashboardSerializer(serializers.Serializer):
    performance = PerformanceMetricsSerializer(required=False, allow_null=True)
    skills_progress = SkillProgressSerializer(many=True, required=False)
    motivation_trends = MotivationTrendSerializer(many=True, required=False)
    daily_engagement = DailyEngagementSerializer(many=True, required=False)
    key_insights = KeyInsightSerializer(many=True, required=False)