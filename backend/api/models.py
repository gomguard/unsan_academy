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
