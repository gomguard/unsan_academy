"""Models for Unsan Academy gamification system."""

from django.db import models
from django.contrib.auth.models import User


class Tier(models.TextChoices):
    UNRANKED = 'Unranked', 'Unranked'
    BRONZE = 'Bronze', 'Bronze'
    SILVER = 'Silver', 'Silver'
    GOLD = 'Gold', 'Gold'
    PLATINUM = 'Platinum', 'Platinum'
    DIAMOND = 'Diamond', 'Diamond'


class MechanicProfile(models.Model):
    """Profile for each mechanic with their stats and tier."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mechanic_profile')
    name = models.CharField(max_length=100)
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.UNRANKED)
    xp = models.IntegerField(default=0)

    # Penta-Stats (0-100)
    stat_tech = models.IntegerField(default=10, help_text="Tech: Diagnosis/Logic")
    stat_hand = models.IntegerField(default=10, help_text="Hand: Craftsmanship/Repair")
    stat_speed = models.IntegerField(default=10, help_text="Speed: Efficiency")
    stat_art = models.IntegerField(default=10, help_text="Art: Detailing/Esthetics")
    stat_biz = models.IntegerField(default=10, help_text="Biz: Sales/Management")

    avatar_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Mechanic Profile"
        verbose_name_plural = "Mechanic Profiles"

    def __str__(self):
        return f"{self.name} ({self.tier})"

    @property
    def stats(self):
        return {
            'Tech': self.stat_tech,
            'Hand': self.stat_hand,
            'Speed': self.stat_speed,
            'Art': self.stat_art,
            'Biz': self.stat_biz,
        }

    def get_tier_xp_thresholds(self):
        """Get XP thresholds for each tier."""
        return {
            'Unranked': 0,
            'Bronze': 100,
            'Silver': 300,
            'Gold': 600,
            'Platinum': 1000,
            'Diamond': 1500,
        }

    def update_tier(self):
        """Update tier based on current XP."""
        thresholds = self.get_tier_xp_thresholds()
        new_tier = 'Unranked'
        for tier, threshold in thresholds.items():
            if self.xp >= threshold:
                new_tier = tier
        self.tier = new_tier
        self.save()


class JobCard(models.Model):
    """Legendary Job Cards that can be unlocked."""
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    image_url = models.URLField(blank=True, null=True)

    # Requirements (nullable = not required)
    req_tech = models.IntegerField(null=True, blank=True)
    req_hand = models.IntegerField(null=True, blank=True)
    req_speed = models.IntegerField(null=True, blank=True)
    req_art = models.IntegerField(null=True, blank=True)
    req_biz = models.IntegerField(null=True, blank=True)

    # Card styling
    rarity = models.CharField(max_length=20, default='legendary')
    color_primary = models.CharField(max_length=7, default='#FFD700')
    color_secondary = models.CharField(max_length=7, default='#FFA500')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Job Card"
        verbose_name_plural = "Job Cards"

    def __str__(self):
        return self.title

    @property
    def requirements(self):
        reqs = {}
        if self.req_tech:
            reqs['Tech'] = self.req_tech
        if self.req_hand:
            reqs['Hand'] = self.req_hand
        if self.req_speed:
            reqs['Speed'] = self.req_speed
        if self.req_art:
            reqs['Art'] = self.req_art
        if self.req_biz:
            reqs['Biz'] = self.req_biz
        return reqs


class UnlockedCard(models.Model):
    """Track which cards a mechanic has unlocked."""
    profile = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='unlocked_cards')
    card = models.ForeignKey(JobCard, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['profile', 'card']
        verbose_name = "Unlocked Card"
        verbose_name_plural = "Unlocked Cards"


class StatType(models.TextChoices):
    TECH = 'Tech', 'Tech'
    HAND = 'Hand', 'Hand'
    SPEED = 'Speed', 'Speed'
    ART = 'Art', 'Art'
    BIZ = 'Biz', 'Biz'


class QuestCategory(models.TextChoices):
    DAILY = 'Daily', '일일 미션'
    WEEKLY = 'Weekly', '주간 미션'
    CHALLENGE = 'Challenge', '도전 과제'
    SPECIAL = 'Special', '특별 미션'


class Task(models.Model):
    """SOP Tasks that mechanics can complete."""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    stat_type = models.CharField(max_length=10, choices=StatType.choices)
    stat_reward = models.IntegerField(default=1, help_text="Stat points rewarded on completion")
    xp_reward = models.IntegerField(default=10, help_text="XP rewarded on completion")
    requires_photo = models.BooleanField(default=False)
    is_daily = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"

    def __str__(self):
        return f"{self.title} (+{self.stat_reward} {self.stat_type})"


class Quest(models.Model):
    """Mission quests with photo verification for stat growth."""
    title = models.CharField(max_length=100)
    description = models.TextField()
    target_stat = models.CharField(max_length=10, choices=StatType.choices)
    stat_reward = models.IntegerField(default=2, help_text="Stat points rewarded")
    xp_reward = models.IntegerField(default=20, help_text="XP rewarded")
    icon = models.CharField(max_length=50, default='Wrench', help_text="Lucide icon name")
    category = models.CharField(max_length=20, choices=QuestCategory.choices, default=QuestCategory.DAILY)

    # Quest settings
    requires_photo = models.BooleanField(default=True)
    cooldown_hours = models.IntegerField(default=24, help_text="Hours before quest can be repeated")
    max_daily_completions = models.IntegerField(default=1)

    # Difficulty/visibility
    difficulty = models.IntegerField(default=1, help_text="1-5 difficulty rating")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Display order")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Quest"
        verbose_name_plural = "Quests"
        ordering = ['order', 'category', 'title']

    def __str__(self):
        return f"{self.title} (+{self.stat_reward} {self.target_stat})"


class QuestCompletion(models.Model):
    """Record of completed quests with photo proof."""
    profile = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='quest_completions')
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name='completions')
    proof_image = models.ImageField(upload_to='quest_proofs/', null=True, blank=True)
    proof_image_url = models.URLField(blank=True, null=True, help_text="External image URL if not using upload")
    notes = models.TextField(blank=True, help_text="Optional notes from user")

    # Verification status
    is_verified = models.BooleanField(default=True, help_text="Auto-verified or admin verified")
    verified_at = models.DateTimeField(null=True, blank=True)

    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Quest Completion"
        verbose_name_plural = "Quest Completions"
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.profile.name} completed {self.quest.title}"


class TaskCompletion(models.Model):
    """Record of completed tasks."""
    profile = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='completed_tasks')
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    photo_url = models.URLField(blank=True, null=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Task Completion"
        verbose_name_plural = "Task Completions"

    def __str__(self):
        return f"{self.profile.name} completed {self.task.title}"


# ============ COMMUNITY MODELS ============

class PostCategory(models.TextChoices):
    FREE = 'Free', '🗣️ 자유게시판'
    TECH = 'Tech', '🔧 기술 Q&A'
    SALARY = 'Salary', '💸 연봉 대나무숲'
    CAREER = 'Career', '🚀 이직/커리어'


class Post(models.Model):
    """Community post with author tier/stats visible."""
    author = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='posts')
    category = models.CharField(max_length=20, choices=PostCategory.choices, default=PostCategory.FREE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    likes = models.IntegerField(default=0)
    views = models.IntegerField(default=0)

    # Optional verification: Link to a JobCard the author has unlocked
    verified_card = models.ForeignKey(JobCard, null=True, blank=True, on_delete=models.SET_NULL)

    # Optional: Attached Salary Gap data
    attached_salary_data = models.JSONField(null=True, blank=True, help_text="Salary gap calculator snapshot")

    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Post"
        verbose_name_plural = "Posts"
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return f"[{self.category}] {self.title} by {self.author.name}"


class Comment(models.Model):
    """Comment on a post with author tier/stats visible."""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author.name} on {self.post.title}"


class PostLike(models.Model):
    """Track likes on posts to prevent duplicate likes."""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes')
    profile = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['post', 'profile']
        verbose_name = "Post Like"
        verbose_name_plural = "Post Likes"
