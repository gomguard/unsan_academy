"""Serializers for the API."""

from rest_framework import serializers
from .models import (
    JobGroup, Job, JobTag, JobTagRelation,
    Academy, Course, CourseTag, CourseTagRelation, Certification,
    MechanicProfile, CareerReview, SuccessStory, StoryJourneyStep,
    Post, Comment, PostLike,
    Quest, QuestCompletion,
    SalaryReport, VerificationStatus
)


# ============ JOB SERIALIZERS ============

class JobTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobTag
        fields = ['id', 'name', 'color']


class JobGroupSerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = JobGroup
        fields = ['id', 'code', 'name', 'color', 'icon', 'description', 'order', 'job_count']

    def get_job_count(self, obj):
        return obj.jobs.count()


class JobSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)
    group_code = serializers.CharField(source='group.code', read_only=True)
    group_icon = serializers.CharField(source='group.icon', read_only=True)
    tags = serializers.SerializerMethodField()
    salary_range_display = serializers.ReadOnlyField()

    class Meta:
        model = Job
        fields = [
            'id', 'code', 'title', 'group', 'group_name', 'group_code', 'group_icon',
            'description', 'salary_min', 'salary_max', 'salary_range_display',
            'market_demand', 'req_tech', 'req_hand', 'req_speed', 'req_art', 'req_biz',
            'hiring_companies', 'source', 'is_starter', 'is_blue_ocean', 'is_ev_transition',
            'tags', 'order'
        ]

    def get_tags(self, obj):
        return list(obj.tag_relations.values_list('tag__name', flat=True))


class JobDetailSerializer(JobSerializer):
    """Job with prerequisites."""
    prerequisites = JobSerializer(many=True, read_only=True)
    unlocks = JobSerializer(many=True, read_only=True)

    class Meta(JobSerializer.Meta):
        fields = JobSerializer.Meta.fields + ['prerequisites', 'unlocks']


# ============ EDUCATION SERIALIZERS ============

class AcademySerializer(serializers.ModelSerializer):
    course_count = serializers.SerializerMethodField()

    class Meta:
        model = Academy
        fields = [
            'id', 'code', 'name', 'logo', 'description', 'location',
            'is_partner', 'website', 'order', 'course_count'
        ]

    def get_course_count(self, obj):
        return obj.courses.filter(is_active=True).count()


class CourseSerializer(serializers.ModelSerializer):
    academy_name = serializers.CharField(source='academy.name', read_only=True)
    academy_logo = serializers.CharField(source='academy.logo', read_only=True)
    tags = serializers.SerializerMethodField()
    target_job_ids = serializers.PrimaryKeyRelatedField(
        source='target_jobs', many=True, read_only=True
    )

    class Meta:
        model = Course
        fields = [
            'id', 'code', 'academy', 'academy_name', 'academy_logo',
            'title', 'description', 'category', 'course_type',
            'duration', 'price', 'price_note', 'url',
            'rating', 'enroll_count', 'is_active', 'tags', 'target_job_ids'
        ]

    def get_tags(self, obj):
        return list(obj.tag_relations.values_list('tag__name', flat=True))


# ============ USER PROFILE SERIALIZERS ============

class MechanicProfileSerializer(serializers.ModelSerializer):
    stats = serializers.ReadOnlyField()
    current_job_title = serializers.CharField(source='current_job.title', read_only=True, allow_null=True)
    target_job_title = serializers.CharField(source='target_job.title', read_only=True, allow_null=True)

    class Meta:
        model = MechanicProfile
        fields = [
            'id', 'name', 'tier', 'xp', 'avatar_url',
            'current_job', 'current_job_title', 'target_job', 'target_job_title',
            'years_experience',
            'stat_tech', 'stat_hand', 'stat_speed', 'stat_art', 'stat_biz', 'stats',
            'current_salary', 'salary_verification_status', 'salary_verified_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'salary_verified_at']


class AuthorSerializer(serializers.ModelSerializer):
    """Compact author info for posts/comments."""
    stats = serializers.ReadOnlyField()

    class Meta:
        model = MechanicProfile
        fields = [
            'id', 'name', 'tier', 'avatar_url', 'stats',
            'stat_tech', 'stat_hand', 'stat_speed', 'stat_art', 'stat_biz',
            'current_salary', 'salary_verification_status'
        ]


# ============ REVIEW SERIALIZERS ============

class CareerReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = CareerReview
        fields = [
            'id', 'author', 'author_name', 'job', 'job_title',
            'title', 'content', 'rating', 'years_in_role',
            'previous_job', 'salary_growth', 'pros', 'cons', 'advice',
            'helpful_count', 'is_verified', 'created_at'
        ]
        read_only_fields = ['helpful_count', 'is_verified', 'created_at']


# ============ SUCCESS STORY SERIALIZERS ============

class StoryJourneyStepSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = StoryJourneyStep
        fields = ['id', 'job', 'job_title', 'order', 'duration', 'salary']


class SuccessStorySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    target_job_title = serializers.CharField(source='target_job.title', read_only=True)
    journey_steps = StoryJourneyStepSerializer(many=True, read_only=True)

    class Meta:
        model = SuccessStory
        fields = [
            'id', 'author', 'author_name', 'target_job', 'target_job_title',
            'title', 'summary', 'total_duration', 'salary_change',
            'key_lessons', 'journey_steps', 'is_verified', 'created_at'
        ]
        read_only_fields = ['is_verified', 'created_at']


# ============ COMMUNITY SERIALIZERS ============

class CommentSerializer(serializers.ModelSerializer):
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
    author = AuthorSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_mine = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    related_job_title = serializers.CharField(source='related_job.title', read_only=True, allow_null=True)

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'category', 'category_display', 'title', 'content',
            'related_job', 'related_job_title',
            'likes', 'views', 'comment_count', 'is_liked', 'is_mine',
            'show_verified_salary', 'is_pinned', 'created_at', 'updated_at'
        ]
        read_only_fields = ['likes', 'views', 'comment_count', 'created_at', 'updated_at', 'is_pinned']

    def get_is_liked(self, obj):
        profile_id = self.context.get('profile_id')
        if not profile_id:
            return False
        return PostLike.objects.filter(post=obj, user_id=profile_id).exists()

    def get_is_mine(self, obj):
        profile_id = self.context.get('profile_id')
        return obj.author_id == profile_id if profile_id else False


class PostDetailSerializer(PostSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ['comments']


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['category', 'title', 'content', 'related_job', 'show_verified_salary']


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']


# ============ QUEST SERIALIZERS ============

class QuestSerializer(serializers.ModelSerializer):
    is_completed_today = serializers.SerializerMethodField()

    class Meta:
        model = Quest
        fields = [
            'id', 'title', 'description', 'target_stat', 'stat_reward',
            'xp_reward', 'icon', 'category', 'requires_photo',
            'cooldown_hours', 'max_daily_completions', 'difficulty',
            'is_active', 'is_completed_today'
        ]

    def get_is_completed_today(self, obj):
        from django.utils import timezone
        profile_id = self.context.get('profile_id')
        if not profile_id:
            return False
        today = timezone.now().date()
        return QuestCompletion.objects.filter(
            profile_id=profile_id,
            quest=obj,
            completed_at__date=today
        ).exists()


class QuestCompletionSerializer(serializers.ModelSerializer):
    quest_title = serializers.CharField(source='quest.title', read_only=True)
    stat_type = serializers.CharField(source='quest.target_stat', read_only=True)
    stat_reward = serializers.IntegerField(source='quest.stat_reward', read_only=True)

    class Meta:
        model = QuestCompletion
        fields = [
            'id', 'quest', 'quest_title', 'stat_type', 'stat_reward',
            'proof_image', 'notes', 'is_verified', 'completed_at'
        ]
        read_only_fields = ['completed_at', 'is_verified']


class CompleteQuestSerializer(serializers.Serializer):
    quest_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)


# ============ SALARY REPORT SERIALIZERS ============

class SalaryReportSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    target_job_title = serializers.CharField(source='target_job.title', read_only=True)
    salary_gap = serializers.ReadOnlyField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = SalaryReport
        fields = [
            'id', 'user', 'user_name', 'target_job', 'target_job_title',
            'current_salary', 'estimated_salary', 'years_experience', 'percentile',
            'user_stats', 'salary_gap', 'proof_image', 'status', 'status_display',
            'verified_at', 'rejection_reason', 'created_at'
        ]
        read_only_fields = ['created_at', 'verified_at']


class CreateSalaryReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryReport
        fields = [
            'target_job', 'current_salary', 'estimated_salary',
            'years_experience', 'percentile', 'user_stats'
        ]
