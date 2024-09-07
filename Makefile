dev:
	docker compose up -d app_dev

prod:
	docker compose up -d app_prod --build

down:
	docker compose rm -f -s -v

logs:
	docker compose logs -f
