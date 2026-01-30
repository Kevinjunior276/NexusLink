from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FormLink, Submission, AppSettings, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class FormLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormLink
        fields = '__all__'
        read_only_fields = ['link_id', 'user']

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'

class AppSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppSettings
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
