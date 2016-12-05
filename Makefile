install:
	composer install && \
	php artisan migrate && \
	php artisan key:generate && \
	php artisan passport:install && \
	cd frontend && \
	npm install && \
	./node_modules/bower/bin/bower install --allow-root && \
	./node_modules/ember-cli/bin/ember build -prod


develop:
	php artisan serve & \
	cd frontend && \
	./node_modules/ember-cli/bin/ember serve
