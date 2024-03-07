#!/bin/bash


sleep 6s
# Check if migrations need to be applied
python manage.py showmigrations | grep -q "0 "  # Checks if there are 0 unapplied migrations
MIGRATION_STATUS=$?

# Apply migrations if needed
if [ $MIGRATION_STATUS -ne 0 ]; then
    echo "Applying migrations..."
    python manage.py migrate
fi


if [ -z "$DJANGO_ENV" ]; then
	gunicorn --workers 8 -b 0.0.0.0:8000 videotranscriberproject.wsgi
else
	# Start the Django development server
	echo "Starting Django development server..."
	python manage.py runserver 0.0.0.0:8000
fi

