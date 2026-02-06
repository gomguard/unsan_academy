"""Models for Unsan Academy - Career Platform Database."""

from django.db import models
from django.contrib.auth.models import User


# ============ ENUMS ============

class MarketDemand(models.TextChoices):
    EXPLOSIVE = 'Explosive', '급상승'
    HIGH = 'High', '높음'
    STABLE = 'Stable', '안정'
    DECLINING = 'Declining', '하락'


class JobGroupType(models.TextChoices):
    MAINTENANCE = 'Maintenance', '정비/메카닉'
    BODY = 'Body', '외장/복원'
    FILM = 'Film', '필름/튜닝'
    EV_FUTURE = 'EV_Future', '전기차/미래'
    MANAGEMENT = 'Management', '경영/서비스'
    NICHE = 'Niche', '특수/니치'
    NEXTGEN = 'NextGen', '미래직업'


class CourseCategory(models.TextChoices):
    MAINTENANCE = 'Maintenance', '정비'
    BODY = 'Body', '외장/복원'
    TUNING = 'Tuning', '튜닝/커스텀'
    EV_FUTURE = 'EV_Future', '전기차/미래'
    MANAGEMENT = 'Management', '경영/관리'


class CourseType(models.TextChoices):
    ONLINE = 'Online', '온라인'
    OFFLINE = 'Offline', '오프라인'
    HYBRID = 'Hybrid', '혼합'


class Tier(models.TextChoices):
    UNRANKED = 'Unranked', 'Unranked'
    BRONZE = 'Bronze', 'Bronze'
    SILVER = 'Silver', 'Silver'
    GOLD = 'Gold', 'Gold'
    PLATINUM = 'Platinum', 'Platinum'
    DIAMOND = 'Diamond', 'Diamond'


class StatType(models.TextChoices):
    TECH = 'Tech', 'Tech (기술/진단)'
    HAND = 'Hand', 'Hand (손기술)'
    SPEED = 'Speed', 'Speed (효율)'
    ART = 'Art', 'Art (예술성)'
    BIZ = 'Biz', 'Biz (경영)'


class VerificationStatus(models.TextChoices):
    NONE = 'None', '미인증'
    PENDING = 'Pending', '심사 중'
    VERIFIED = 'Verified', '인증 완료'
    REJECTED = 'Rejected', '반려됨'


# ============ JOB DATABASE ============

class JobGroup(models.Model):
    """7 major job groups/categories."""
    code = models.CharField(max_length=20, unique=True, choices=JobGroupType.choices)
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#3b82f6', help_text='Hex color code')
    icon = models.CharField(max_length=10, help_text='Emoji icon')
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name = "직업 그룹"
        verbose_name_plural = "직업 그룹"
        ordering = ['order']

    def __str__(self):
        return f"{self.icon} {self.name}"


class Job(models.Model):
    """88 jobs in the career database."""
    # Basic info
    code = models.CharField(max_length=20, unique=True, help_text='e.g., maint_01, ev_03')
    title = models.CharField(max_length=100)
    group = models.ForeignKey(JobGroup, on_delete=models.CASCADE, related_name='jobs')
    description = models.TextField()

    # Salary (만원 단위)
    salary_min = models.IntegerField(help_text='최저 연봉 (만원)')
    salary_max = models.IntegerField(help_text='최고 연봉 (만원)')
    market_demand = models.CharField(max_length=20, choices=MarketDemand.choices, default=MarketDemand.STABLE)

    # Required stats (0-100)
    req_tech = models.IntegerField(default=30, help_text='Tech 요구치')
    req_hand = models.IntegerField(default=30, help_text='Hand 요구치')
    req_speed = models.IntegerField(default=30, help_text='Speed/Ops 요구치')
    req_art = models.IntegerField(default=30, help_text='Art 요구치')
    req_biz = models.IntegerField(default=30, help_text='Biz 요구치')

    # Prerequisites (self-referencing many-to-many)
    prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='unlocks')

    # Additional info
    hiring_companies = models.TextField(blank=True, help_text='채용 중인 회사들 (쉼표 구분)')
    source = models.CharField(max_length=200, blank=True, help_text='데이터 출처')

    # Metadata
    is_starter = models.BooleanField(default=False, help_text='선행 조건 없는 입문 직업')
    is_blue_ocean = models.BooleanField(default=False, help_text='고연봉 + 고수요 블루오션')
    is_ev_transition = models.BooleanField(default=False, help_text='EV 전환 경로 직업')

    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "직업"
        verbose_name_plural = "직업"
        ordering = ['group', 'order', 'title']

    def __str__(self):
        return f"{self.title} ({self.group.name})"

    @property
    def salary_range_display(self):
        return f"{self.salary_min:,}~{self.salary_max:,}만원"


class JobTag(models.Model):
    """Tags for jobs (입문추천, 고연봉, 블루오션, etc.)."""
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#6b7280')

    class Meta:
        verbose_name = "직업 태그"
        verbose_name_plural = "직업 태그"

    def __str__(self):
        return self.name


class JobTagRelation(models.Model):
    """Many-to-many relation between jobs and tags."""
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='tag_relations')
    tag = models.ForeignKey(JobTag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['job', 'tag']
        verbose_name = "직업-태그 연결"
        verbose_name_plural = "직업-태그 연결"


# ============ EDUCATION DATABASE ============

class Academy(models.Model):
    """교육 기관."""
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    logo = models.CharField(max_length=10, help_text='Emoji logo')
    description = models.TextField()
    location = models.CharField(max_length=100)
    is_partner = models.BooleanField(default=False, help_text='공인 파트너 기관')
    website = models.URLField(blank=True)

    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "교육 기관"
        verbose_name_plural = "교육 기관"
        ordering = ['-is_partner', 'order', 'name']

    def __str__(self):
        partner = "⭐ " if self.is_partner else ""
        return f"{partner}{self.logo} {self.name}"


class Course(models.Model):
    """교육 과정."""
    code = models.CharField(max_length=50, unique=True)
    academy = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=200)
    description = models.TextField()

    # Target jobs this course prepares for
    target_jobs = models.ManyToManyField(Job, blank=True, related_name='courses')

    # Course details
    category = models.CharField(max_length=20, choices=CourseCategory.choices)
    course_type = models.CharField(max_length=20, choices=CourseType.choices)
    duration = models.CharField(max_length=50, help_text='e.g., 4주, 2일 (16시간)')
    price = models.IntegerField(default=0, help_text='수강료 (만원), 0=무료')
    price_note = models.CharField(max_length=100, blank=True, help_text='e.g., 국비지원 100%')

    # Optional info
    url = models.URLField(blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)
    enroll_count = models.IntegerField(default=0, help_text='수강생 수')

    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "교육 과정"
        verbose_name_plural = "교육 과정"
        ordering = ['academy', 'order', 'title']

    def __str__(self):
        return f"{self.title} ({self.academy.name})"


class CourseTag(models.Model):
    """Tags for courses (국비지원, 실습위주, 자격증, etc.)."""
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name = "과정 태그"
        verbose_name_plural = "과정 태그"

    def __str__(self):
        return self.name


class CourseTagRelation(models.Model):
    """Many-to-many relation between courses and tags."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='tag_relations')
    tag = models.ForeignKey(CourseTag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['course', 'tag']
        verbose_name = "과정-태그 연결"
        verbose_name_plural = "과정-태그 연결"


class Certification(models.Model):
    """자격증 that can be obtained from courses."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    issuing_org = models.CharField(max_length=100, blank=True, help_text='발급 기관')

    class Meta:
        verbose_name = "자격증"
        verbose_name_plural = "자격증"

    def __str__(self):
        return self.name


class CourseCertification(models.Model):
    """Certifications obtainable from a course."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certifications')
    certification = models.ForeignKey(Certification, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['course', 'certification']
        verbose_name = "과정-자격증 연결"
        verbose_name_plural = "과정-자격증 연결"


# ============ USER PROFILE ============

class MechanicProfile(models.Model):
    """User profile with stats, tier, and career info."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mechanic_profile')
    name = models.CharField(max_length=100)
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.UNRANKED)
    xp = models.IntegerField(default=0)

    # Current/target job
    current_job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True, related_name='current_holders')
    target_job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True, related_name='target_seekers')
    years_experience = models.IntegerField(default=0)

    # Penta-Stats (0-100)
    stat_tech = models.IntegerField(default=10)
    stat_hand = models.IntegerField(default=10)
    stat_speed = models.IntegerField(default=10)
    stat_art = models.IntegerField(default=10)
    stat_biz = models.IntegerField(default=10)

    avatar_url = models.URLField(blank=True, null=True)

    # Salary verification
    current_salary = models.IntegerField(null=True, blank=True, help_text='현재 연봉 (만원)')
    salary_proof_image = models.ImageField(upload_to='salary_proofs/', null=True, blank=True)
    salary_verification_status = models.CharField(
        max_length=10,
        choices=VerificationStatus.choices,
        default=VerificationStatus.NONE
    )
    salary_verified_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "사용자 프로필"
        verbose_name_plural = "사용자 프로필"

    def __str__(self):
        return f"{self.name} ({self.tier})"

    @property
    def stats(self):
        return {
            'T': self.stat_tech,
            'H': self.stat_hand,
            'S': self.stat_speed,
            'A': self.stat_art,
            'B': self.stat_biz,
        }


# ============ CAREER REVIEWS ============

class CareerReview(models.Model):
    """Real reviews from people in a specific job."""
    author = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='career_reviews')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='reviews')

    # Review content
    title = models.CharField(max_length=200)
    content = models.TextField()
    rating = models.IntegerField(default=4, help_text='1-5 rating')
    years_in_role = models.IntegerField(default=1)
    previous_job = models.CharField(max_length=100, blank=True)
    salary_growth = models.CharField(max_length=50, blank=True, help_text='e.g., +50%, 2배')

    # Pros/Cons (stored as JSON arrays)
    pros = models.JSONField(default=list, help_text='장점 리스트')
    cons = models.JSONField(default=list, help_text='단점 리스트')
    advice = models.TextField(blank=True, help_text='후배에게 하는 조언')

    # Engagement
    helpful_count = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "커리어 리뷰"
        verbose_name_plural = "커리어 리뷰"
        ordering = ['-helpful_count', '-created_at']

    def __str__(self):
        return f"{self.title} by {self.author.name}"


class ReviewHelpful(models.Model):
    """Track helpful votes on reviews."""
    review = models.ForeignKey(CareerReview, on_delete=models.CASCADE, related_name='helpful_votes')
    user = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['review', 'user']
        verbose_name = "리뷰 도움됨"
        verbose_name_plural = "리뷰 도움됨"


# ============ SUCCESS STORIES ============

class SuccessStory(models.Model):
    """Career transition success stories."""
    author = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='success_stories')
    target_job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='success_stories')

    title = models.CharField(max_length=200)
    summary = models.TextField()
    total_duration = models.CharField(max_length=50, help_text='e.g., 5년')
    salary_change = models.CharField(max_length=100, help_text='e.g., 2,800 → 6,500만원 (+132%)')
    key_lessons = models.JSONField(default=list, help_text='핵심 교훈 리스트')

    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "성공 스토리"
        verbose_name_plural = "성공 스토리"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.author.name}"


class StoryJourneyStep(models.Model):
    """Individual steps in a success story journey."""
    story = models.ForeignKey(SuccessStory, on_delete=models.CASCADE, related_name='journey_steps')
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    duration = models.CharField(max_length=50, help_text='e.g., 2년, 현재')
    salary = models.CharField(max_length=50, blank=True, help_text='e.g., 3,500만원')

    class Meta:
        verbose_name = "스토리 여정 단계"
        verbose_name_plural = "스토리 여정 단계"
        ordering = ['story', 'order']


# ============ COMMUNITY ============

class PostCategory(models.TextChoices):
    FREE = 'Free', '자유게시판'
    TECH = 'Tech', '기술 Q&A'
    SALARY = 'Salary', '연봉 대나무숲'
    CAREER = 'Career', '이직/커리어'


class Post(models.Model):
    """Community posts."""
    author = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='posts')
    category = models.CharField(max_length=20, choices=PostCategory.choices, default=PostCategory.FREE)
    title = models.CharField(max_length=200)
    content = models.TextField()

    # Optional job reference
    related_job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True)

    # Engagement
    likes = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)

    # Settings
    show_verified_salary = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "게시글"
        verbose_name_plural = "게시글"
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return f"[{self.get_category_display()}] {self.title}"


class Comment(models.Model):
    """Comments on posts."""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "댓글"
        verbose_name_plural = "댓글"
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author.name}"


class PostLike(models.Model):
    """Track post likes."""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes')
    user = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['post', 'user']
        verbose_name = "좋아요"
        verbose_name_plural = "좋아요"


# ============ QUESTS & TASKS ============

class QuestCategory(models.TextChoices):
    DAILY = 'Daily', '일일 미션'
    WEEKLY = 'Weekly', '주간 미션'
    CHALLENGE = 'Challenge', '도전 과제'
    SPECIAL = 'Special', '특별 미션'


class Quest(models.Model):
    """Mission quests for stat growth."""
    title = models.CharField(max_length=100)
    description = models.TextField()
    target_stat = models.CharField(max_length=10, choices=StatType.choices)
    stat_reward = models.IntegerField(default=2)
    xp_reward = models.IntegerField(default=20)
    icon = models.CharField(max_length=50, default='Wrench')
    category = models.CharField(max_length=20, choices=QuestCategory.choices, default=QuestCategory.DAILY)

    requires_photo = models.BooleanField(default=True)
    cooldown_hours = models.IntegerField(default=24)
    max_daily_completions = models.IntegerField(default=1)
    difficulty = models.IntegerField(default=1, help_text='1-5')

    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "퀘스트"
        verbose_name_plural = "퀘스트"
        ordering = ['order', 'category']

    def __str__(self):
        return f"{self.title} (+{self.stat_reward} {self.target_stat})"


class QuestCompletion(models.Model):
    """Quest completion records."""
    profile = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='quest_completions')
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name='completions')
    proof_image = models.ImageField(upload_to='quest_proofs/', null=True, blank=True)
    notes = models.TextField(blank=True)

    is_verified = models.BooleanField(default=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "퀘스트 완료"
        verbose_name_plural = "퀘스트 완료"
        ordering = ['-completed_at']


# ============ SALARY REPORTS ============

class SalaryReport(models.Model):
    """User salary reports for market analysis."""
    user = models.ForeignKey(MechanicProfile, on_delete=models.CASCADE, related_name='salary_reports')
    target_job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='salary_reports')

    # Salary data
    current_salary = models.IntegerField(help_text='실제 연봉 (만원)')
    estimated_salary = models.IntegerField(help_text='시장 가치 (만원)')
    years_experience = models.IntegerField()
    percentile = models.IntegerField(default=50, help_text='0-100 백분위')

    # Stats snapshot
    user_stats = models.JSONField(default=dict)

    # Verification
    proof_image = models.ImageField(upload_to='salary_proofs/', null=True, blank=True)
    status = models.CharField(max_length=10, choices=VerificationStatus.choices, default=VerificationStatus.NONE)
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "연봉 리포트"
        verbose_name_plural = "연봉 리포트"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.name} - {self.target_job.title}"

    @property
    def salary_gap(self):
        return self.estimated_salary - self.current_salary
