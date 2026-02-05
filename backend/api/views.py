"""API Views for Unsan Academy."""

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import F

from .models import MechanicProfile, JobCard, Task, TaskCompletion, UnlockedCard
from .serializers import (
    MechanicProfileSerializer, JobCardSerializer, TaskSerializer,
    TaskCompletionSerializer, CompleteTaskSerializer
)


class MechanicProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for MechanicProfile."""
    queryset = MechanicProfile.objects.all()
    serializer_class = MechanicProfileSerializer

    @action(detail=True, methods=['post'])
    def complete_task(self, request, pk=None):
        """Complete a task and update stats."""
        profile = self.get_object()
        serializer = CompleteTaskSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        task_id = serializer.validated_data['task_id']
        photo_url = serializer.validated_data.get('photo_url', '')

        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if already completed today (for daily tasks)
        if task.is_daily:
            today = timezone.now().date()
            already_done = TaskCompletion.objects.filter(
                profile=profile,
                task=task,
                completed_at__date=today
            ).exists()
            if already_done:
                return Response({'error': 'Task already completed today'}, status=status.HTTP_400_BAD_REQUEST)

        # Create completion record
        completion = TaskCompletion.objects.create(
            profile=profile,
            task=task,
            photo_url=photo_url
        )

        # Update stats
        stat_field = f'stat_{task.stat_type.lower()}'
        current_value = getattr(profile, stat_field)
        new_value = min(100, current_value + task.stat_reward)
        setattr(profile, stat_field, new_value)

        # Update XP
        profile.xp += task.xp_reward
        profile.save()

        # Update tier if needed
        profile.update_tier()

        # Check for newly unlockable cards
        newly_unlocked = self._check_unlockable_cards(profile)

        return Response({
            'success': True,
            'stat_updated': task.stat_type,
            'stat_change': task.stat_reward,
            'new_value': new_value,
            'xp_gained': task.xp_reward,
            'total_xp': profile.xp,
            'tier': profile.tier,
            'newly_unlocked_cards': [card.title for card in newly_unlocked]
        })

    def _check_unlockable_cards(self, profile):
        """Check and unlock any cards that meet requirements."""
        stats = profile.stats
        unlocked = []

        for card in JobCard.objects.all():
            # Skip if already unlocked
            if UnlockedCard.objects.filter(profile=profile, card=card).exists():
                continue

            # Check requirements
            can_unlock = True
            for stat_name, required_value in card.requirements.items():
                if stats.get(stat_name, 0) < required_value:
                    can_unlock = False
                    break

            if can_unlock:
                UnlockedCard.objects.create(profile=profile, card=card)
                unlocked.append(card)

        return unlocked


class JobCardViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for JobCards."""
    queryset = JobCard.objects.all()
    serializer_class = JobCardSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        profile_id = self.request.query_params.get('profile_id')
        if profile_id:
            context['profile_id'] = int(profile_id)
        return context


class TaskViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Tasks."""
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        profile_id = self.request.query_params.get('profile_id')
        if profile_id:
            context['profile_id'] = int(profile_id)
        return context


@api_view(['GET'])
def dashboard_data(request, profile_id):
    """Get all dashboard data in one request."""
    try:
        profile = MechanicProfile.objects.get(id=profile_id)
    except MechanicProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    # Get profile data
    profile_data = MechanicProfileSerializer(profile).data

    # Get job cards with unlock status
    cards = JobCard.objects.all()
    cards_serializer = JobCardSerializer(
        cards, many=True,
        context={'profile_id': profile_id}
    )

    # Get tasks with completion status
    tasks = Task.objects.filter(is_daily=True)
    tasks_serializer = TaskSerializer(
        tasks, many=True,
        context={'profile_id': profile_id}
    )

    # Get today's completions
    today = timezone.now().date()
    today_completions = TaskCompletion.objects.filter(
        profile=profile,
        completed_at__date=today
    )
    completions_serializer = TaskCompletionSerializer(today_completions, many=True)

    return Response({
        'profile': profile_data,
        'job_cards': cards_serializer.data,
        'daily_tasks': tasks_serializer.data,
        'today_completions': completions_serializer.data,
    })
