"""Django Admin configuration for Unsan Academy."""

from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import (
    # Job models
    JobGroup, Job, JobTag, JobTagRelation,
    # Education models
    Academy, Course, CourseTag, CourseTagRelation, Certification, CourseCertification,
    # User models
    MechanicProfile,
    # Career models
    CareerReview, ReviewHelpful, SuccessStory, StoryJourneyStep,
    # Community models
    Post, Comment, PostLike,
    # Quest models
    Quest, QuestCompletion,
    # Salary models
    SalaryReport,
    VerificationStatus,
)


# ============ ADMIN SITE CONFIGURATION ============

admin.site.site_header = "운산 아카데미 관리자"
admin.site.site_title = "운산 아카데미"
admin.site.index_title = "데이터베이스 관리"


# ============ INLINE ADMINS ============

class JobTagRelationInline(admin.TabularInline):
    model = JobTagRelation
    extra = 1
    autocomplete_fields = ['tag']


class CourseTagRelationInline(admin.TabularInline):
    model = CourseTagRelation
    extra = 1
    autocomplete_fields = ['tag']


class CourseCertificationInline(admin.TabularInline):
    model = CourseCertification
    extra = 1
    autocomplete_fields = ['certification']


class StoryJourneyStepInline(admin.TabularInline):
    model = StoryJourneyStep
    extra = 1
    autocomplete_fields = ['job']


class CourseInline(admin.TabularInline):
    model = Course
    extra = 0
    fields = ['code', 'title', 'category', 'course_type', 'price', 'is_active']
    readonly_fields = ['code', 'title']
    show_change_link = True
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


# ============ JOB DATABASE ADMIN ============

@admin.register(JobGroup)
class JobGroupAdmin(admin.ModelAdmin):
    list_display = ['icon_display', 'name', 'code', 'job_count', 'color_display', 'order']
    list_editable = ['order']
    search_fields = ['name', 'code']
    ordering = ['order']

    def icon_display(self, obj):
        return format_html('<span style="font-size: 24px;">{}</span>', obj.icon)
    icon_display.short_description = '아이콘'

    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 4px;">{}</span>',
            obj.color, obj.color
        )
    color_display.short_description = '색상'

    def job_count(self, obj):
        return obj.jobs.count()
    job_count.short_description = '직업 수'


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'group', 'salary_display', 'demand_display',
        'prereq_count', 'is_starter', 'is_blue_ocean', 'order'
    ]
    list_filter = ['group', 'market_demand', 'is_starter', 'is_blue_ocean', 'is_ev_transition']
    search_fields = ['code', 'title', 'description']
    list_editable = ['order']
    autocomplete_fields = ['group', 'prerequisites']
    filter_horizontal = ['prerequisites']
    inlines = [JobTagRelationInline]

    fieldsets = (
        ('기본 정보', {
            'fields': ('code', 'title', 'group', 'description')
        }),
        ('연봉 & 시장', {
            'fields': ('salary_min', 'salary_max', 'market_demand')
        }),
        ('요구 스탯', {
            'fields': (('req_tech', 'req_hand'), ('req_speed', 'req_art'), 'req_biz'),
            'classes': ('collapse',)
        }),
        ('선행 조건', {
            'fields': ('prerequisites',),
        }),
        ('추가 정보', {
            'fields': ('hiring_companies', 'source'),
            'classes': ('collapse',)
        }),
        ('메타데이터', {
            'fields': (('is_starter', 'is_blue_ocean', 'is_ev_transition'), 'order'),
        }),
    )

    def salary_display(self, obj):
        return f"{obj.salary_min:,}~{obj.salary_max:,}만원"
    salary_display.short_description = '연봉'

    def demand_display(self, obj):
        colors = {
            'Explosive': '#ef4444',
            'High': '#f59e0b',
            'Stable': '#10b981',
            'Declining': '#6b7280',
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.market_demand, '#000'),
            obj.get_market_demand_display()
        )
    demand_display.short_description = '수요'

    def prereq_count(self, obj):
        return obj.prerequisites.count()
    prereq_count.short_description = '선행'


@admin.register(JobTag)
class JobTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'color_display', 'job_count']
    search_fields = ['name']

    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 4px;">{}</span>',
            obj.color, obj.name
        )
    color_display.short_description = '태그'

    def job_count(self, obj):
        return JobTagRelation.objects.filter(tag=obj).count()
    job_count.short_description = '사용 수'


# ============ EDUCATION ADMIN ============

@admin.register(Academy)
class AcademyAdmin(admin.ModelAdmin):
    list_display = ['logo_display', 'name', 'location', 'is_partner', 'course_count', 'order']
    list_filter = ['is_partner', 'location']
    search_fields = ['name', 'code', 'description']
    list_editable = ['is_partner', 'order']
    inlines = [CourseInline]

    def logo_display(self, obj):
        partner = "⭐" if obj.is_partner else ""
        return format_html('<span style="font-size: 20px;">{} {}</span>', obj.logo, partner)
    logo_display.short_description = '로고'

    def course_count(self, obj):
        return obj.courses.count()
    course_count.short_description = '과정 수'


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'academy', 'category', 'course_type',
        'price_display', 'rating', 'enroll_count', 'is_active'
    ]
    list_filter = ['academy', 'category', 'course_type', 'is_active']
    search_fields = ['code', 'title', 'description']
    list_editable = ['is_active']
    autocomplete_fields = ['academy', 'target_jobs']
    filter_horizontal = ['target_jobs']
    inlines = [CourseTagRelationInline, CourseCertificationInline]

    fieldsets = (
        ('기본 정보', {
            'fields': ('code', 'academy', 'title', 'description')
        }),
        ('과정 정보', {
            'fields': ('category', 'course_type', 'duration', ('price', 'price_note'))
        }),
        ('대상 직업', {
            'fields': ('target_jobs',),
        }),
        ('통계', {
            'fields': (('rating', 'enroll_count'), 'url'),
        }),
        ('설정', {
            'fields': (('is_active', 'order'),),
        }),
    )

    def price_display(self, obj):
        if obj.price == 0:
            return format_html('<span style="color: #10b981; font-weight: bold;">무료</span>')
        return f"{obj.price}만원"
    price_display.short_description = '수강료'

    actions = ['mark_active', 'mark_inactive']

    @admin.action(description='선택 과정 활성화')
    def mark_active(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='선택 과정 비활성화')
    def mark_inactive(self, request, queryset):
        queryset.update(is_active=False)


@admin.register(CourseTag)
class CourseTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'course_count']
    search_fields = ['name']

    def course_count(self, obj):
        return CourseTagRelation.objects.filter(tag=obj).count()
    course_count.short_description = '사용 수'


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['name', 'issuing_org', 'course_count']
    search_fields = ['name', 'issuing_org']

    def course_count(self, obj):
        return CourseCertification.objects.filter(certification=obj).count()
    course_count.short_description = '관련 과정'


# ============ USER ADMIN ============

@admin.register(MechanicProfile)
class MechanicProfileAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'user', 'tier', 'xp', 'current_job',
        'salary_display', 'verification_status', 'created_at'
    ]
    list_filter = ['tier', 'salary_verification_status']
    search_fields = ['name', 'user__username', 'user__email']
    autocomplete_fields = ['current_job', 'target_job']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('계정 정보', {
            'fields': ('user', 'name', 'avatar_url')
        }),
        ('게임화', {
            'fields': (('tier', 'xp'),)
        }),
        ('직업 정보', {
            'fields': ('current_job', 'target_job', 'years_experience')
        }),
        ('스탯', {
            'fields': (
                ('stat_tech', 'stat_hand'),
                ('stat_speed', 'stat_art'),
                'stat_biz'
            ),
        }),
        ('연봉 인증', {
            'fields': (
                'current_salary', 'salary_proof_image',
                ('salary_verification_status', 'salary_verified_at')
            ),
        }),
        ('메타데이터', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def salary_display(self, obj):
        if obj.current_salary:
            return f"{obj.current_salary:,}만원"
        return "-"
    salary_display.short_description = '현재 연봉'

    def verification_status(self, obj):
        colors = {
            'Verified': '#10b981',
            'Pending': '#f59e0b',
            'Rejected': '#ef4444',
            'None': '#6b7280',
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            colors.get(obj.salary_verification_status, '#000'),
            obj.get_salary_verification_status_display()
        )
    verification_status.short_description = '인증 상태'

    actions = ['approve_salary', 'reject_salary']

    @admin.action(description='연봉 인증 승인')
    def approve_salary(self, request, queryset):
        count = queryset.filter(salary_verification_status='Pending').update(
            salary_verification_status='Verified',
            salary_verified_at=timezone.now()
        )
        self.message_user(request, f'{count}명 인증 승인됨')

    @admin.action(description='연봉 인증 반려')
    def reject_salary(self, request, queryset):
        count = queryset.filter(salary_verification_status='Pending').update(
            salary_verification_status='Rejected'
        )
        self.message_user(request, f'{count}명 인증 반려됨')


# ============ CAREER REVIEW ADMIN ============

@admin.register(CareerReview)
class CareerReviewAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'job', 'author', 'rating_display',
        'years_in_role', 'helpful_count', 'is_verified', 'created_at'
    ]
    list_filter = ['job__group', 'rating', 'is_verified']
    search_fields = ['title', 'content', 'author__name']
    autocomplete_fields = ['author', 'job']
    readonly_fields = ['helpful_count', 'created_at', 'updated_at']

    fieldsets = (
        ('기본 정보', {
            'fields': ('author', 'job', 'title')
        }),
        ('리뷰 내용', {
            'fields': ('content', 'rating', 'years_in_role', 'previous_job', 'salary_growth')
        }),
        ('장단점', {
            'fields': ('pros', 'cons', 'advice'),
        }),
        ('통계 & 인증', {
            'fields': (('helpful_count', 'is_verified', 'verified_at'),),
        }),
    )

    def rating_display(self, obj):
        stars = "⭐" * obj.rating
        return stars
    rating_display.short_description = '평점'

    actions = ['mark_verified']

    @admin.action(description='선택 리뷰 인증 완료')
    def mark_verified(self, request, queryset):
        queryset.update(is_verified=True, verified_at=timezone.now())


# ============ SUCCESS STORY ADMIN ============

@admin.register(SuccessStory)
class SuccessStoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'target_job', 'total_duration', 'salary_change', 'is_verified', 'created_at']
    list_filter = ['target_job__group', 'is_verified']
    search_fields = ['title', 'summary', 'author__name']
    autocomplete_fields = ['author', 'target_job']
    inlines = [StoryJourneyStepInline]

    fieldsets = (
        ('기본 정보', {
            'fields': ('author', 'target_job', 'title')
        }),
        ('스토리', {
            'fields': ('summary', 'total_duration', 'salary_change', 'key_lessons')
        }),
        ('설정', {
            'fields': ('is_verified',),
        }),
    )

    actions = ['mark_verified']

    @admin.action(description='선택 스토리 인증 완료')
    def mark_verified(self, request, queryset):
        queryset.update(is_verified=True)


# ============ COMMUNITY ADMIN ============

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'likes', 'views', 'comment_count', 'is_pinned', 'created_at']
    list_filter = ['category', 'is_pinned', 'show_verified_salary']
    search_fields = ['title', 'content', 'author__name']
    autocomplete_fields = ['author', 'related_job']
    list_editable = ['is_pinned']
    readonly_fields = ['likes', 'views', 'comment_count', 'created_at', 'updated_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['short_content', 'post', 'author', 'likes', 'created_at']
    search_fields = ['content', 'author__name']
    autocomplete_fields = ['post', 'author']

    def short_content(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    short_content.short_description = '내용'


# ============ QUEST ADMIN ============

@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'target_stat', 'stat_reward', 'xp_reward',
        'difficulty', 'requires_photo', 'is_active', 'order'
    ]
    list_filter = ['category', 'target_stat', 'is_active', 'requires_photo']
    search_fields = ['title', 'description']
    list_editable = ['is_active', 'order']

    fieldsets = (
        ('기본 정보', {
            'fields': ('title', 'description', 'icon', 'category')
        }),
        ('보상', {
            'fields': (('target_stat', 'stat_reward'), 'xp_reward')
        }),
        ('설정', {
            'fields': (
                'requires_photo', 'cooldown_hours', 'max_daily_completions',
                'difficulty', ('is_active', 'order')
            ),
        }),
    )

    actions = ['mark_active', 'mark_inactive']

    @admin.action(description='선택 퀘스트 활성화')
    def mark_active(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='선택 퀘스트 비활성화')
    def mark_inactive(self, request, queryset):
        queryset.update(is_active=False)


@admin.register(QuestCompletion)
class QuestCompletionAdmin(admin.ModelAdmin):
    list_display = ['profile', 'quest', 'is_verified', 'completed_at']
    list_filter = ['is_verified', 'quest__category']
    search_fields = ['profile__name', 'quest__title']
    autocomplete_fields = ['profile', 'quest']
    readonly_fields = ['completed_at']


# ============ SALARY REPORT ADMIN ============

@admin.register(SalaryReport)
class SalaryReportAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'target_job', 'current_salary_display', 'estimated_display',
        'gap_display', 'status', 'created_at'
    ]
    list_filter = ['status', 'target_job__group']
    search_fields = ['user__name', 'target_job__title']
    autocomplete_fields = ['user', 'target_job']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('사용자 정보', {
            'fields': ('user', 'target_job', 'years_experience')
        }),
        ('연봉 데이터', {
            'fields': (('current_salary', 'estimated_salary'), 'percentile', 'user_stats')
        }),
        ('인증', {
            'fields': ('proof_image', ('status', 'verified_at'), 'rejection_reason'),
        }),
    )

    def current_salary_display(self, obj):
        return f"{obj.current_salary:,}만원"
    current_salary_display.short_description = '현재 연봉'

    def estimated_display(self, obj):
        return f"{obj.estimated_salary:,}만원"
    estimated_display.short_description = '시장 가치'

    def gap_display(self, obj):
        gap = obj.salary_gap
        if gap > 0:
            color = '#ef4444'
            sign = '-'
        elif gap < 0:
            color = '#10b981'
            sign = '+'
        else:
            color = '#6b7280'
            sign = ''
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}{:,}만원</span>',
            color, sign, abs(gap)
        )
    gap_display.short_description = '격차'

    actions = ['approve_selected', 'reject_selected']

    @admin.action(description='인증 승인')
    def approve_selected(self, request, queryset):
        count = queryset.update(
            status=VerificationStatus.VERIFIED,
            verified_at=timezone.now(),
            rejection_reason=''
        )
        self.message_user(request, f'{count}개 리포트 승인됨')

    @admin.action(description='인증 반려')
    def reject_selected(self, request, queryset):
        count = queryset.update(
            status=VerificationStatus.REJECTED,
            rejection_reason='제출된 서류가 기준에 부적합합니다.'
        )
        self.message_user(request, f'{count}개 리포트 반려됨')
