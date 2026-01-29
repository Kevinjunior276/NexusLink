from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FormLinkViewSet, SubmissionViewSet, AppSettingsViewSet, UserProfileViewSet, NotificationViewSet
from .auth_views import register_user

router = DefaultRouter()
router.register(r'links', FormLinkViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'settings', AppSettingsViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
]
