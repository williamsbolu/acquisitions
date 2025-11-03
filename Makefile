# Makefile for Acquisitions Docker Setup

.PHONY: dev prod build clean help logs

# Default environment
ENV ?= dev

# Development commands
dev:
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up

dev-build:
	@echo "Building and starting development environment..."
	docker-compose -f docker-compose.dev.yml up --build

dev-down:
	@echo "Stopping development environment..."
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	@echo "Showing development logs..."
	docker-compose -f docker-compose.dev.yml logs -f

dev-studio:
	@echo "Starting development with Drizzle Studio..."
	docker-compose -f docker-compose.dev.yml --profile studio up

# Production commands
prod:
	@echo "Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d

prod-build:
	@echo "Building and starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d --build

prod-down:
	@echo "Stopping production environment..."
	docker-compose -f docker-compose.prod.yml down

prod-logs:
	@echo "Showing production logs..."
	docker-compose -f docker-compose.prod.yml logs -f

# Database commands
db-migrate-dev:
	@echo "Running migrations in development..."
	docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

db-migrate-prod:
	@echo "Running migrations in production..."
	docker-compose -f docker-compose.prod.yml exec app npm run db:migrate

db-studio:
	@echo "Opening Drizzle Studio..."
	npm run db:studio

# Build commands
build-dev:
	@echo "Building development image..."
	docker build --target dev -t acquisitions:dev .

build-prod:
	@echo "Building production image..."
	docker build --target production -t acquisitions:prod .

# Cleanup commands
clean:
	@echo "Cleaning up Docker resources..."
	docker system prune -f
	docker volume prune -f

clean-all:
	@echo "Cleaning up all Docker resources (including images)..."
	docker system prune -af
	docker volume prune -f

# Utility commands
shell-dev:
	@echo "Opening shell in development container..."
	docker-compose -f docker-compose.dev.yml exec app sh

shell-prod:
	@echo "Opening shell in production container..."
	docker-compose -f docker-compose.prod.yml exec app sh

status:
	@echo "Docker container status..."
	docker ps -a

# Help command
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  dev           - Start development environment"
	@echo "  dev-build     - Build and start development environment"
	@echo "  dev-down      - Stop development environment"
	@echo "  dev-logs      - Show development logs"
	@echo "  dev-studio    - Start development with Drizzle Studio"
	@echo ""
	@echo "Production:"
	@echo "  prod          - Start production environment"
	@echo "  prod-build    - Build and start production environment"
	@echo "  prod-down     - Stop production environment"
	@echo "  prod-logs     - Show production logs"
	@echo ""
	@echo "Database:"
	@echo "  db-migrate-dev - Run migrations in development"
	@echo "  db-migrate-prod- Run migrations in production"
	@echo "  db-studio     - Open Drizzle Studio"
	@echo ""
	@echo "Build:"
	@echo "  build-dev     - Build development image"
	@echo "  build-prod    - Build production image"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean         - Clean Docker resources"
	@echo "  clean-all     - Clean all Docker resources"
	@echo ""
	@echo "Utilities:"
	@echo "  shell-dev     - Open shell in development container"
	@echo "  shell-prod    - Open shell in production container"
	@echo "  status        - Show container status"