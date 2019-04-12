docker-build:
				docker-compose -f docker-compose-dev.yml up -d --build
docker-stop:
				docker-compose -f docker-compose-dev.yml stop
docker-down:
				docker-compose -f docker-compose-dev.yml down
user-test:
				docker-compose -f docker-compose-dev.yml exec users python manage.py test
user-test-cov:
				docker-compose -f docker-compose-dev.yml exec users python manage.py cov
client-test:
				docker-compose -f docker-compose-dev.yml exec client npm test
