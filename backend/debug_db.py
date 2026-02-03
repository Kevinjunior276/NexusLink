import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import FormLink, Submission

print("=== USERS IN DATABASE ===")
for u in User.objects.all():
    print(f"- ID: {u.id} | Username: {u.username} | Super: {u.is_superuser}")

print("\n=== FORMLINKS IN DATABASE ===")
for l in FormLink.objects.all():
    print(f"- ID: {l.id} | Name: {l.name} | User: {l.user.username if l.user else 'NULL'}")

print("\n=== SUBMISSIONS IN DATABASE ===")
for s in Submission.objects.all():
    print(f"- ID: {s.id} | Full Name: {s.full_name} | User: {s.user.username if s.user else 'NULL'}")
