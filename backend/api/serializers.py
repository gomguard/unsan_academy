"""Serializers for the API."""

from rest_framework import serializers
from .models import MechanicProfile, JobCard, Task, TaskCompletion, UnlockedCard


class MechanicProfileSerializer(serializers.ModelSerializer):
    stats = serializers.ReadOnlyField()
    next_tier_xp = serializers.SerializerMethodField()
    current_tier_xp = serializers.SerializerMethodField()

    class Meta:
        model = MechanicProfile
        fields = [
            'id', 'name', 'tier', 'xp', 'avatar_url',
            'stat_tech', 'stat_hand', 'stat_speed', 'stat_art', 'stat_biz',
            'stats', 'next_tier_xp', 'current_tier_xp', 'created_at', 'updated_at'
        ]

    def get_next_tier_xp(self, obj):
        thresholds = obj.get_tier_xp_thresholds()
        tier_list = list(thresholds.keys())
        current_index = tier_list.index(obj.tier)
        if current_index < len(tier_list) - 1:
            return thresholds[tier_list[current_index + 1]]
        return thresholds[obj.tier]

    def get_current_tier_xp(self, obj):
        thresholds = obj.get_tier_xp_thresholds()
        return thresholds.get(obj.tier, 0)


class JobCardSerializer(serializers.ModelSerializer):
    requirements = serializers.ReadOnlyField()
    is_unlocked = serializers.SerializerMethodField()

    class Meta:
        model = JobCard
        fields = [
            'id', 'title', 'subtitle', 'description', 'image_url',
            'requirements', 'rarity', 'color_primary', 'color_secondary',
            'is_unlocked'
        ]

    def get_is_unlocked(self, obj):
        request = self.context.get('request')
        profile_id = self.context.get('profile_id')

        if profile_id:
            return UnlockedCard.objects.filter(profile_id=profile_id, card=obj).exists()
        return False


class TaskSerializer(serializers.ModelSerializer):
    is_completed_today = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'stat_type', 'stat_reward',
            'xp_reward', 'requires_photo', 'is_daily', 'is_completed_today'
        ]

    def get_is_completed_today(self, obj):
        from django.utils import timezone
        from datetime import timedelta

        profile_id = self.context.get('profile_id')
        if not profile_id:
            return False

        today = timezone.now().date()
        return TaskCompletion.objects.filter(
            profile_id=profile_id,
            task=obj,
            completed_at__date=today
        ).exists()


class TaskCompletionSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source='task.title', read_only=True)
    stat_type = serializers.CharField(source='task.stat_type', read_only=True)
    stat_reward = serializers.IntegerField(source='task.stat_reward', read_only=True)

    class Meta:
        model = TaskCompletion
        fields = ['id', 'task', 'task_title', 'stat_type', 'stat_reward', 'photo_url', 'completed_at']
        read_only_fields = ['completed_at']


class CompleteTaskSerializer(serializers.Serializer):
    """Serializer for completing a task."""
    task_id = serializers.IntegerField()
    photo_url = serializers.URLField(required=False, allow_blank=True)
