from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import FormLink, Submission, AppSettings, Notification
from .serializers import FormLinkSerializer, SubmissionSerializer, AppSettingsSerializer, UserSerializer, NotificationSerializer
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

class FormLinkViewSet(viewsets.ModelViewSet):
    queryset = FormLink.objects.all()
    serializer_class = FormLinkSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'link_id'

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all().order_by('-created_at')
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        print(f"Incoming submission data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Validation Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        submission = serializer.save()
        print(f"Submission saved: {submission.id}")
        
        try:
            Notification.objects.create(
                title="Nouvelle soumission !",
                message=f"{submission.full_name} a envoyé ses informations via {submission.method}.",
                type="success"
            )
            print("Notification created successfully")
        except Exception as e:
            print(f"Critical error creating notification: {e}")

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['delete'])
    def delete_old(self, request):
        six_months_ago = timezone.now() - timedelta(days=180)
        deleted_count, _ = Submission.objects.filter(created_at__lt=six_months_ago).delete()
        return Response({'message': f'{deleted_count} submissions deleted.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def reset_all(self, request):
        Submission.objects.all().delete()
        FormLink.objects.all().delete()
        Notification.objects.all().delete()
        return Response({'message': 'All data has been reset.'}, status=status.HTTP_200_OK)

class AppSettingsViewSet(viewsets.ModelViewSet):
    queryset = AppSettings.objects.all()
    serializer_class = AppSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if AppSettings.objects.count() == 0:
            AppSettings.objects.create()
        return AppSettings.objects.all()

    @action(detail=False, methods=['get', 'patch'])
    def singleton(self, request):
        setting, _ = AppSettings.objects.get_or_create(id=1)
        if request.method == 'PATCH':
            serializer = self.get_serializer(setting, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        
        serializer = self.get_serializer(setting)
        return Response(serializer.data)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.all().update(is_read=True)
        return Response({'status': 'ok'})

class UserProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        user = request.user
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)
        
        password = request.data.get('password')
        if password:
            user.set_password(password)
        
        user.save()
        return Response({'message': 'Profile updated successfully'})
