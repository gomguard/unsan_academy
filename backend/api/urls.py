"""URL patterns for the API."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.MechanicProfileViewSet)
router.register(r'cards', views.JobCardViewSet)
router.register(r'tasks', views.TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/<int:profile_id>/', views.dashboard_data, name='dashboard-data'),
]
