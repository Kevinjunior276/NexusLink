from django.contrib import admin
from .models import FormLink, Submission, AppSettings, Notification

@admin.register(FormLink)
class FormLinkAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'link_id', 'expiry_date', 'created_at')
    search_fields = ('name', 'link_id', 'user__username')
    list_filter = ('created_at', 'expiry_date')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'method', 'status', 'created_at', 'user')
    search_fields = ('full_name', 'email', 'account_number', 'user__username')
    list_filter = ('status', 'method', 'created_at')
    readonly_fields = ('created_at',)

@admin.register(AppSettings)
class AppSettingsAdmin(admin.ModelAdmin):
    list_display = ('app_name', 'user', 'updated_at')
    search_fields = ('app_name', 'user__username')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'user__username')
    list_filter = ('type', 'is_read', 'created_at')
