"""API Views for Unsan Academy."""

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import F, Count

from .models import (
    JobGroup, Job, Academy, Course,
    MechanicProfile, CareerReview, SuccessStory,
    Post, Comment, PostLike,
    Quest, QuestCompletion,
    SalaryReport, VerificationStatus
)
from .serializers import (
    JobGroupSerializer, JobSerializer, JobDetailSerializer,
    AcademySerializer, CourseSerializer,
    MechanicProfileSerializer, AuthorSerializer,
    CareerReviewSerializer, SuccessStorySerializer,
    PostSerializer, PostDetailSerializer, CreatePostSerializer,
    CommentSerializer, CreateCommentSerializer,
    QuestSerializer, QuestCompletionSerializer, CompleteQuestSerializer,
    SalaryReportSerializer, CreateSalaryReportSerializer
)


# ============ JOB VIEWSETS ============

class JobGroupViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for job groups (7 categories)."""
    queryset = JobGroup.objects.all()
    serializer_class = JobGroupSerializer


class JobViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for jobs (88 careers)."""
    queryset = Job.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return JobDetailSerializer
        return JobSerializer

    def get_queryset(self):
        queryset = Job.objects.all()
        group = self.request.query_params.get('group')
        if group:
            queryset = queryset.filter(group__code=group)

        is_starter = self.request.query_params.get('is_starter')
        if is_starter == 'true':
            queryset = queryset.filter(is_starter=True)

        is_blue_ocean = self.request.query_params.get('is_blue_ocean')
        if is_blue_ocean == 'true':
            queryset = queryset.filter(is_blue_ocean=True)

        is_ev = self.request.query_params.get('is_ev_transition')
        if is_ev == 'true':
            queryset = queryset.filter(is_ev_transition=True)

        return queryset


# ============ EDUCATION VIEWSETS ============

class AcademyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for academies."""
    queryset = Academy.objects.all()
    serializer_class = AcademySerializer


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for courses."""
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer

    def get_queryset(self):
        queryset = Course.objects.filter(is_active=True)
        academy = self.request.query_params.get('academy')
        if academy:
            queryset = queryset.filter(academy_id=academy)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        job = self.request.query_params.get('job')
        if job:
            queryset = queryset.filter(target_jobs__id=job)

        return queryset


# ============ PROFILE VIEWSET ============

class MechanicProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for MechanicProfile."""
    queryset = MechanicProfile.objects.all()
    serializer_class = MechanicProfileSerializer

    @action(detail=True, methods=['post'])
    def complete_quest(self, request, pk=None):
        """Complete a quest and update stats."""
        profile = self.get_object()
        serializer = CompleteQuestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        quest_id = serializer.validated_data['quest_id']
        notes = serializer.validated_data.get('notes', '')

        try:
            quest = Quest.objects.get(id=quest_id, is_active=True)
        except Quest.DoesNotExist:
            return Response({'error': 'Quest not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check cooldown
        today = timezone.now().date()
        today_completions = QuestCompletion.objects.filter(
            profile=profile,
            quest=quest,
            completed_at__date=today
        ).count()

        if today_completions >= quest.max_daily_completions:
            return Response({'error': 'Quest completion limit reached'}, status=status.HTTP_400_BAD_REQUEST)

        # Create completion record
        completion = QuestCompletion.objects.create(
            profile=profile,
            quest=quest,
            notes=notes
        )

        # Update stats
        stat_field = f'stat_{quest.target_stat.lower()}'
        if hasattr(profile, stat_field):
            current_value = getattr(profile, stat_field)
            new_value = min(100, current_value + quest.stat_reward)
            setattr(profile, stat_field, new_value)

        # Update XP
        profile.xp += quest.xp_reward
        profile.save()

        return Response({
            'success': True,
            'stat_updated': quest.target_stat,
            'stat_change': quest.stat_reward,
            'new_value': new_value if hasattr(profile, stat_field) else None,
            'xp_gained': quest.xp_reward,
            'total_xp': profile.xp,
            'tier': profile.tier,
        })

    @action(detail=True, methods=['post'])
    def update_salary(self, request, pk=None):
        """Update current salary for the profile."""
        profile = self.get_object()
        salary = request.data.get('current_salary')

        if salary is None:
            return Response({'error': 'current_salary required'}, status=status.HTTP_400_BAD_REQUEST)

        profile.current_salary = int(salary)
        profile.save(update_fields=['current_salary', 'updated_at'])

        return Response(MechanicProfileSerializer(profile).data)

    @action(detail=True, methods=['post'])
    def upload_salary_proof(self, request, pk=None):
        """Upload salary proof image for verification."""
        profile = self.get_object()

        proof_image = request.FILES.get('salary_proof_image')
        if not proof_image:
            return Response({'error': 'salary_proof_image required'}, status=status.HTTP_400_BAD_REQUEST)

        profile.salary_proof_image = proof_image
        profile.salary_verification_status = VerificationStatus.PENDING
        profile.save(update_fields=['salary_proof_image', 'salary_verification_status', 'updated_at'])

        return Response(MechanicProfileSerializer(profile).data)


# ============ QUEST VIEWSET ============

class QuestViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Quests."""
    queryset = Quest.objects.filter(is_active=True)
    serializer_class = QuestSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        profile_id = self.request.query_params.get('profile_id')
        if profile_id:
            context['profile_id'] = int(profile_id)
        return context

    def get_queryset(self):
        queryset = Quest.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


# ============ REVIEW VIEWSETS ============

class CareerReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for career reviews."""
    queryset = CareerReview.objects.all()
    serializer_class = CareerReviewSerializer

    def get_queryset(self):
        queryset = CareerReview.objects.all()
        job = self.request.query_params.get('job')
        if job:
            queryset = queryset.filter(job_id=job)
        return queryset


class SuccessStoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for success stories."""
    queryset = SuccessStory.objects.all()
    serializer_class = SuccessStorySerializer

    def get_queryset(self):
        queryset = SuccessStory.objects.all()
        job = self.request.query_params.get('job')
        if job:
            queryset = queryset.filter(target_job_id=job)
        return queryset


# ============ COMMUNITY VIEWS ============

class PostViewSet(viewsets.ModelViewSet):
    """ViewSet for community posts."""
    queryset = Post.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PostDetailSerializer
        if self.action == 'create':
            return CreatePostSerializer
        return PostSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        profile_id = self.request.query_params.get('profile_id')
        if profile_id:
            context['profile_id'] = int(profile_id)
        return context

    def get_queryset(self):
        queryset = Post.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    def create(self, request, *args, **kwargs):
        profile_id = request.data.get('author_id') or request.query_params.get('profile_id')
        if not profile_id:
            return Response({'error': 'profile_id required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile = MechanicProfile.objects.get(id=profile_id)
        except MechanicProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreatePostSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save(author=profile)
            return Response(PostSerializer(post, context={'profile_id': int(profile_id)}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.views = F('views') + 1
        instance.save(update_fields=['views'])
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Toggle like on a post."""
        profile_id = request.data.get('profile_id') or request.query_params.get('profile_id')
        if not profile_id:
            return Response({'error': 'profile_id required'}, status=status.HTTP_400_BAD_REQUEST)

        post = self.get_object()
        try:
            profile = MechanicProfile.objects.get(id=profile_id)
        except MechanicProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        like, created = PostLike.objects.get_or_create(post=post, user=profile)
        if not created:
            like.delete()
            post.likes = F('likes') - 1
            post.save(update_fields=['likes'])
            post.refresh_from_db()
            return Response({'liked': False, 'likes': post.likes})
        else:
            post.likes = F('likes') + 1
            post.save(update_fields=['likes'])
            post.refresh_from_db()
            return Response({'liked': True, 'likes': post.likes})

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        """Add a comment to a post."""
        profile_id = request.data.get('profile_id') or request.query_params.get('profile_id')
        if not profile_id:
            return Response({'error': 'profile_id required'}, status=status.HTTP_400_BAD_REQUEST)

        post = self.get_object()
        try:
            profile = MechanicProfile.objects.get(id=profile_id)
        except MechanicProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(author=profile, post=post)
            return Response(CommentSerializer(comment, context={'profile_id': int(profile_id)}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for comments."""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        profile_id = self.request.query_params.get('profile_id')
        if profile_id:
            context['profile_id'] = int(profile_id)
        return context


# ============ SALARY REPORT VIEWS ============

class SalaryReportViewSet(viewsets.ModelViewSet):
    """ViewSet for salary reports."""
    queryset = SalaryReport.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateSalaryReportSerializer
        return SalaryReportSerializer

    def get_queryset(self):
        queryset = SalaryReport.objects.all()
        profile_id = self.request.query_params.get('profile_id')
        if profile_id:
            queryset = queryset.filter(user_id=profile_id)
        return queryset

    def create(self, request, *args, **kwargs):
        profile_id = request.data.get('profile_id') or request.query_params.get('profile_id')
        if not profile_id:
            return Response({'error': 'profile_id required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile = MechanicProfile.objects.get(id=profile_id)
        except MechanicProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateSalaryReportSerializer(data=request.data)
        if serializer.is_valid():
            report = serializer.save(user=profile)
            return Response(
                SalaryReportSerializer(report).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_proof(self, request, pk=None):
        """Upload proof image for verification."""
        report = self.get_object()

        profile_id = request.data.get('profile_id') or request.query_params.get('profile_id')
        if not profile_id or report.user_id != int(profile_id):
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        proof_image = request.FILES.get('proof_image')
        if not proof_image:
            return Response({'error': 'proof_image required'}, status=status.HTTP_400_BAD_REQUEST)

        report.proof_image = proof_image
        report.status = VerificationStatus.PENDING
        report.save()
        return Response(SalaryReportSerializer(report).data)

    @action(detail=False, methods=['get'])
    def my_reports(self, request):
        """Get current user's reports."""
        profile_id = request.query_params.get('profile_id')
        if not profile_id:
            return Response({'error': 'profile_id required'}, status=status.HTTP_400_BAD_REQUEST)

        reports = SalaryReport.objects.filter(user_id=profile_id).order_by('-created_at')
        serializer = SalaryReportSerializer(reports, many=True)
        return Response(serializer.data)


# ============ DASHBOARD DATA ============

@api_view(['GET'])
def dashboard_data(request, profile_id):
    """Get all dashboard data in one request."""
    try:
        profile = MechanicProfile.objects.get(id=profile_id)
    except MechanicProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    # Get profile data
    profile_data = MechanicProfileSerializer(profile).data

    # Get daily quests with completion status
    quests = Quest.objects.filter(is_active=True, category='Daily')
    quests_serializer = QuestSerializer(
        quests, many=True,
        context={'profile_id': profile_id}
    )

    # Get today's completions
    today = timezone.now().date()
    today_completions = QuestCompletion.objects.filter(
        profile=profile,
        completed_at__date=today
    )
    completions_serializer = QuestCompletionSerializer(today_completions, many=True)

    return Response({
        'profile': profile_data,
        'daily_quests': quests_serializer.data,
        'today_completions': completions_serializer.data,
    })
