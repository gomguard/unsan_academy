"""WSGI config for unsan_academy project."""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'unsan_academy.settings')
application = get_wsgi_application()
