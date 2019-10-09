docker-build:
				docker-compose up -d --build
docker-logs:
				docker-compose logs -f
docker-stop:
				docker-compose stop
docker-down:
				docker-compose down
user-test:
				docker-compose exec users python manage.py test
user-test-cov:
				docker-compose exec users python manage.py cov
client-test:
				docker-compose exec client npm test -- --verbose
