from django.apps import AppConfig


class TownsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'towns'
    
    def ready(self):
        """Import admin when app is ready"""
        import towns.admin  # noqa