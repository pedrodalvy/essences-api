dev:
	docker compose up -d cache
	docker compose up -d app_dev

prod:
	docker compose up -d cache
	docker compose up -d app_prod --build

down:
	docker compose rm -f -s -v

logs:
	docker compose logs -f

test-e2e:
	make dev
	docker compose run --rm app_dev yarn test:e2e --verbose
