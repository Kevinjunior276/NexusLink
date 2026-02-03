import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import FormLink, Submission

print("--- USERS ---")
users = User.objects.all()
for u in users:
    print(f"ID: {u.id}, Username: {u.username}, Email: {u.email}, Superuser: {u.is_superuser}")

print("\n--- FORMLINKS ---")
links = FormLink.objects.all()
for l in links:
    print(f"ID: {l.id}, Name: {l.name}, LinkID: {l.link_id}, User: {l.user.username if l.user else 'None'}")

print("\n--- SUBMISSIONS ---")
subs = Submission.objects.all()
for s in subs:
    print(f"ID: {s.id}, Name: {s.full_name}, User: {s.user.username if s.user else 'None'}")
