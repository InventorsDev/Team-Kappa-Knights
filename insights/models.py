from django.db import models


class PerformanceMetrics(models.Model):
    MOTIVATION_LEVELS = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    user_profile = models.OneToOneField(
        "userprofile.UserProfile",
        to_field="user_id",               # explicitly target the CharField PK
        db_column="user_id",              # DB column name
        on_delete=models.CASCADE,
        related_name="performance_metrics",
    )
    skills_completed = models.PositiveIntegerField(default=0)
    active_days = models.PositiveIntegerField(default=0)
    hours_studied = models.FloatField(default=0)
    motivation_level = models.CharField(max_length=10, choices=MOTIVATION_LEVELS, default="medium")
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user_profile.full_name} - Performance"


class SkillProgress(models.Model):
    user_profile = models.ForeignKey(
        "userprofile.UserProfile",
        to_field="user_id",
        db_column="user_id",
        on_delete=models.CASCADE,
        related_name="skills_progress",
    )
    skill_name = models.CharField(max_length=100)
    completion_percent = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.skill_name} ({self.completion_percent}%)"


class MotivationTrend(models.Model):
    user_profile = models.ForeignKey(
        "userprofile.UserProfile",
        to_field="user_id",
        db_column="user_id",
        on_delete=models.CASCADE,
        related_name="motivation_trends",
    )
    week_number = models.PositiveIntegerField()
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user_profile", "week_number")

    def __str__(self):
        return f"{self.user_profile.full_name} - Week {self.week_number}: {self.score}"


class DailyEngagement(models.Model):
    DAYS_OF_WEEK = [
        ("mon", "Monday"),
        ("tue", "Tuesday"),
        ("wed", "Wednesday"),
        ("thu", "Thursday"),
        ("fri", "Friday"),
        ("sat", "Saturday"),
        ("sun", "Sunday"),
    ]

    user_profile = models.ForeignKey(
        "userprofile.UserProfile",
        to_field="user_id",
        db_column="user_id",
        on_delete=models.CASCADE,
        related_name="daily_engagement",
    )
    day_of_week = models.CharField(max_length=3, choices=DAYS_OF_WEEK)
    hours = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user_profile", "day_of_week")

    def __str__(self):
        return f"{self.user_profile.full_name} - {self.day_of_week}: {self.hours} hrs"


class KeyInsight(models.Model):
    CATEGORIES = [
        ("progress", "Progress"),
        ("pattern", "Pattern"),
        ("recommendation", "Recommendation"),
    ]

    user_profile = models.ForeignKey(
        "userprofile.UserProfile",
        to_field="user_id",
        db_column="user_id",
        on_delete=models.CASCADE,
        related_name="key_insights",
    )
    category = models.CharField(max_length=20, choices=CATEGORIES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_profile.full_name} - {self.category}"
