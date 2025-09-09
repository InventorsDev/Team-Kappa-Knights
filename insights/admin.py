from django.contrib import admin

# Register your models here.
from .models import PerformanceMetrics, SkillProgress, MotivationTrend, DailyEngagement, KeyInsight

admin.site.register(PerformanceMetrics)
admin.site.register(SkillProgress)
admin.site.register(MotivationTrend)
admin.site.register(DailyEngagement)
admin.site.register(KeyInsight)