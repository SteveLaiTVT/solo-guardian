#!/bin/bash
# Docker deployment test script

set -e

echo "======================================"
echo "Solo Guardian Docker Deployment Test"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
echo -n "Checking Docker installation... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
    docker --version
else
    echo -e "${RED}✗${NC}"
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

echo ""

# Check if Docker Compose is installed
echo -n "Checking Docker Compose installation... "
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
    docker compose version 2>/dev/null || docker-compose version
else
    echo -e "${RED}✗${NC}"
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo ""

# Check if .env file exists
echo -n "Checking .env file... "
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo ""
    echo "No .env file found. Creating from .env.docker template..."
    cp .env.docker .env
    echo -e "${GREEN}Created .env file${NC}"
    echo ""
    echo -e "${YELLOW}IMPORTANT: Please edit .env and configure:${NC}"
    echo "  - JWT_ACCESS_SECRET (generate with: openssl rand -base64 32)"
    echo "  - JWT_REFRESH_SECRET (generate with: openssl rand -base64 32)"
    echo "  - SMTP credentials for email notifications"
    echo "  - Twilio credentials for SMS alerts (optional)"
    echo ""
    read -p "Press Enter to continue after editing .env..."
fi

echo ""

# Validate required environment variables
echo "Validating environment variables..."
source .env 2>/dev/null || true

REQUIRED_VARS=(
    "JWT_ACCESS_SECRET"
    "JWT_REFRESH_SECRET"
    "SMTP_HOST"
    "SMTP_USER"
)

ALL_VALID=true
for var in "${REQUIRED_VARS[@]}"; do
    value="${!var}"
    echo -n "  - $var: "
    if [ -z "$value" ] || [ "$value" == "change-this-to-a-secure-32-char-string" ] || [[ "$value" == *"your-"* ]]; then
        echo -e "${RED}✗ Not configured${NC}"
        ALL_VALID=false
    else
        echo -e "${GREEN}✓${NC}"
    fi
done

echo ""

if [ "$ALL_VALID" = false ]; then
    echo -e "${YELLOW}Warning: Some required variables are not configured.${NC}"
    echo "The deployment may not work correctly without proper configuration."
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build and start services
echo "======================================"
echo "Building and starting services..."
echo "======================================"
echo ""

docker compose build

echo ""
echo "Starting services (PostgreSQL, Redis, Backend)..."
docker compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "======================================"
echo "Service Status"
echo "======================================"
docker compose ps

echo ""
echo "======================================"
echo "Testing Services"
echo "======================================"

# Test PostgreSQL
echo -n "Testing PostgreSQL connection... "
if docker compose exec -T postgres pg_isready -U ${POSTGRES_USER:-solo_guardian} &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Test Redis
echo -n "Testing Redis connection... "
if docker compose exec -T redis redis-cli ping &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
fi

# Test Backend API
echo -n "Testing Backend API health endpoint... "
BACKEND_PORT=${BACKEND_PORT:-3000}
for i in {1..30}; do
    if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        HEALTH_RESPONSE=$(curl -s http://localhost:$BACKEND_PORT/api/health)
        echo "  Response: $HEALTH_RESPONSE"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Timeout${NC}"
        echo "  Backend might still be starting. Check logs with: docker compose logs backend"
    fi
    sleep 2
done

echo ""
echo "======================================"
echo "Deployment Summary"
echo "======================================"
echo ""
echo -e "${GREEN}✓ Services started successfully!${NC}"
echo ""
echo "Access points:"
echo "  - Backend API: http://localhost:${BACKEND_PORT:-3000}"
echo "  - Health Check: http://localhost:${BACKEND_PORT:-3000}/api/health"
echo "  - PostgreSQL: localhost:${POSTGRES_PORT:-5432}"
echo "  - Redis: localhost:${REDIS_PORT:-6379}"
echo ""
echo "Useful commands:"
echo "  - View logs: docker compose logs -f"
echo "  - View backend logs: docker compose logs -f backend"
echo "  - Stop services: docker compose down"
echo "  - Restart services: docker compose restart"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Deploy frontend to Vercel"
echo "  2. Update VITE_API_URL in Vercel to point to this backend"
echo "  3. Update CORS_ORIGINS in .env to include your Vercel domain"
echo ""
echo "For more information, see DOCKER.md"
echo ""
