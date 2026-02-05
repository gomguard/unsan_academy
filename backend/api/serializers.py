"""Serializers for the API."""

from rest_framework import serializers
from .models import MechanicProfile, JobCard, Task, TaskCompletion, UnlockedCard, Post, Comment, PostLike


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


# ============ COMMUNITY SERIALIZERS ============

class AuthorSerializer(serializers.ModelSerializer):
    """Compact author info with tier and stats."""
    stats = serializers.ReadOnlyField()

    class Meta:
        model = MechanicProfile
        fields = ['id', 'name', 'tier', 'avatar_url', 'stats', 'stat_tech', 'stat_hand', 'stat_speed', 'stat_art', 'stat_biz']


class CommentSerializer(serializers.ModelSerializer):
    """Comment serializer with author info."""
    author = AuthorSerializer(read_only=True)
    is_mine = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'likes', 'is_mine', 'created_at']
        read_only_fields = ['likes', 'created_at']

    def get_is_mine(self, obj):
        profile_id = self.context.get('profile_id')
        return obj.author_id == profile_id if profile_id else False


class PostSerializer(serializers.ModelSerializer):
    """Post serializer with author info and stats."""
    author = AuthorSerializer(read_only=True)
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_mine = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    verified_card_title = serializers.CharField(source='verified_card.title', read_only=True, allow_null=True)

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'category', 'category_display', 'title', 'content',
            'likes', 'views', 'comment_count', 'is_liked', 'is_mine',
            'verified_card', 'verified_card_title', 'attached_salary_data',
            'is_pinned', 'created_at', 'updated_at'
        ]
        read_only_fields = ['likes', 'views', 'created_at', 'updated_at', 'is_pinned']

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        profile_id = self.context.get('profile_id')
        if not profile_id:
            return False
        return PostLike.objects.filter(post=obj, profile_id=profile_id).exists()

    def get_is_mine(self, obj):
        profile_id = self.context.get('profile_id')
        return obj.author_id == profile_id if profile_id else False


class PostDetailSerializer(PostSerializer):
    """Post serializer with comments included."""
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ['comments']


class CreatePostSerializer(serializers.ModelSerializer):
    """Serializer for creating a post."""

    class Meta:
        model = Post
        fields = ['category', 'title', 'content', 'verified_card', 'attached_salary_data']


class CreateCommentSerializer(serializers.ModelSerializer):
    """Serializer for creating a comment."""

    class Meta:
        model = Comment
        fields = ['content']
