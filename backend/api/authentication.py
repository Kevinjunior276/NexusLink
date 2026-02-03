from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Allow users to log in with either their username or their email address.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        
        # If username is not provided, try to get it from kwargs (DRF passes it differently sometimes)
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
            
        try:
            # Try to fetch candidate users by searching both username and email fields
            users = UserModel.objects.filter(Q(username__iexact=username) | Q(email__iexact=username))
            
            for user in users:
                if user.check_password(password) and self.user_can_authenticate(user):
                    return user
            
        except Exception:
            return None
            
        return None
