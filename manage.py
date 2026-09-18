#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    # Tell Django which settings module should configure management commands.
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'glownext.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # Pass the user's command, such as runserver or migrate, to Django.
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
