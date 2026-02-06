"""URL patterns for the API."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Job database
router.register(r'job-groups', views.JobGroupViewSet)
router.register(r'jobs', views.JobViewSet)

# Education
router.register(r'academies', views.AcademyViewSet)
router.register(r'courses', views.CourseViewSet)

# User profiles
router.register(r'profiles', views.MechanicProfileViewSet)

# Quests
router.register(r'quests', views.QuestViewSet)

# Reviews & Stories
router.register(r'reviews', views.CareerReviewViewSet)
router.register(r'stories', views.SuccessStoryViewSet)

# Community
router.register(r'posts', views.PostViewSet)
router.register(r'comments', views.CommentViewSet)

# Salary reports
router.register(r'reports', views.SalaryReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/<int:profile_id>/', views.dashboard_data, name='dashboard-data'),
]
