"""Admin configuration for Unsan Academy."""

from django.contrib import admin
from .models import MechanicProfile, JobCard, Task, TaskCompletion, UnlockedCard


@admin.register(MechanicProfile)
class MechanicProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'tier', 'xp', 'stat_tech', 'stat_hand', 'stat_speed', 'stat_art', 'stat_biz']
    list_filter = ['tier']
    search_fields = ['name', 'user__username']


@admin.register(JobCard)
class JobCardAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'rarity', 'req_tech', 'req_hand', 'req_speed', 'req_art', 'req_biz']
    list_filter = ['rarity']
    search_fields = ['title', 'description']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'stat_type', 'stat_reward', 'xp_reward', 'is_daily', 'requires_photo']
    list_filter = ['stat_type', 'is_daily']
    search_fields = ['title']


@admin.register(TaskCompletion)
class TaskCompletionAdmin(admin.ModelAdmin):
    list_display = ['profile', 'task', 'completed_at']
    list_filter = ['completed_at']
    date_hierarchy = 'completed_at'


@admin.register(UnlockedCard)
class UnlockedCardAdmin(admin.ModelAdmin):
    list_display = ['profile', 'card', 'unlocked_at']
    list_filter = ['unlocked_at', 'card']
