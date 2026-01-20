# Docker Deployment Guide

This guide explains how to deploy Solo Guardian using Docker Compose.

## Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/SteveLaiTVT/solo-guardian.git
cd solo-guardian
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.docker .env
```

Edit `.env` and configure the following **required** variables:

```bash
# JWT Secrets (CRITICAL - Generate strong secrets!)
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# SMS Configuration (for alerts)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Start Services

```bash
# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend
```

### 4. Verify Deployment

```bash
# Check service status
docker-compose ps

# Test backend API
curl http://localhost:3000/health

# Access PostgreSQL
docker-compose exec postgres psql -U solo_guardian -d solo_guardian

# Access Redis
docker-compose exec redis redis-cli ping
```

## Architecture

The Docker Compose setup includes 3 services:

```
┌─────────────────┐
│   Backend API   │  Port 3000
│    (NestJS)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼────┐ ┌─▼─────┐
│Postgres│ │ Redis  │
│  5432  │ │  6379  │
└────────┘ └────────┘
```

### Services

1. **postgres**: PostgreSQL 16 database
   - Port: 5432
   - Data persistence: `postgres_data` volume
   - Health checks enabled

2. **redis**: Redis 7 (for BullMQ queue)
   - Port: 6379
   - Data persistence: `redis_data` volume
   - AOF persistence enabled

3. **backend**: NestJS API server
   - Port: 3000 (configurable via `BACKEND_PORT`)
   - Automatic Prisma migrations on startup
   - Health checks enabled

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_ACCESS_SECRET` | JWT access token secret (min 32 chars) | Generated via `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | JWT refresh token secret (min 32 chars) | Generated via `openssl rand -base64 32` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password | Gmail app password |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKEND_PORT` | Backend API port | `3000` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `REDIS_PORT` | Redis port | `6379` |
| `POSTGRES_USER` | PostgreSQL username | `solo_guardian` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `solo_guardian_pass` |
| `POSTGRES_DB` | PostgreSQL database name | `solo_guardian` |
| `NODE_ENV` | Node environment | `production` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | See `.env.docker` |

### Twilio (SMS Notifications)

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number (E.164 format) |

### OAuth (Optional)

| Variable | Description |
|----------|-------------|
| `GOOGLE_OAUTH_ENABLED` | Enable Google OAuth (`true`/`false`) |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth client secret |
| `APPLE_OAUTH_ENABLED` | Enable Apple OAuth (`true`/`false`) |

## Port Configuration

All ports are configurable via environment variables:

```bash
# Default ports
BACKEND_PORT=3000
POSTGRES_PORT=5432
REDIS_PORT=6379

# Custom ports (example)
BACKEND_PORT=8080
POSTGRES_PORT=5433
REDIS_PORT=6380
```

## Common Commands

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart backend only
docker-compose restart backend

# Stop and remove volumes (WARNING: deletes data!)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 -f
```

### Database Management

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U solo_guardian -d solo_guardian

# Run Prisma migrations manually
docker-compose exec backend pnpm run prisma:migrate deploy

# Open Prisma Studio (requires port mapping)
docker-compose exec backend pnpm run prisma:studio

# Backup database
docker-compose exec postgres pg_dump -U solo_guardian solo_guardian > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U solo_guardian -d solo_guardian
```

### Redis Management

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Check Redis connection
docker-compose exec redis redis-cli ping

# Monitor Redis commands
docker-compose exec redis redis-cli monitor
```

## Production Deployment

### Security Best Practices

1. **Generate Strong Secrets**
   ```bash
   # Generate JWT secrets
   openssl rand -base64 32  # For JWT_ACCESS_SECRET
   openssl rand -base64 32  # For JWT_REFRESH_SECRET
   ```

2. **Use Strong Database Password**
   ```bash
   POSTGRES_PASSWORD=$(openssl rand -base64 24)
   ```

3. **Configure CORS**
   ```bash
   # Add your Vercel frontend URL
   CORS_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
   ```

4. **Enable HTTPS**
   - Use a reverse proxy (Nginx, Caddy, Traefik)
   - Or deploy to a platform with built-in HTTPS (Railway, Render)

5. **Regular Backups**
   ```bash
   # Automated daily backup (add to crontab)
   0 2 * * * docker-compose exec -T postgres pg_dump -U solo_guardian solo_guardian | gzip > backup-$(date +\%Y\%m\%d).sql.gz
   ```

### Vercel + Docker Backend

For a production setup with Vercel frontend:

1. **Deploy Backend** using Docker Compose on:
   - VPS (DigitalOcean, AWS EC2, Linode)
   - Railway (supports Docker Compose)
   - Render (supports Dockerfile)

2. **Update Frontend Environment**
   In Vercel dashboard, set:
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

3. **Update Backend CORS**
   In your `.env`:
   ```
   CORS_ORIGINS=https://your-app.vercel.app
   ```

### Scaling Considerations

As your app grows:

1. **Database**
   - Use managed PostgreSQL (AWS RDS, Railway, Render)
   - Enable connection pooling

2. **Redis**
   - Use managed Redis (Upstash, Redis Cloud)
   - Enable persistence and backups

3. **Backend**
   - Run multiple backend instances behind a load balancer
   - Use Docker Swarm or Kubernetes for orchestration

4. **Monitoring**
   - Add health check endpoints
   - Use monitoring tools (Prometheus, Grafana)
   - Log aggregation (ELK stack, Loki)

## Troubleshooting

### Backend Won't Start

**Symptom**: Backend container exits immediately

**Solutions**:
```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database not ready - wait for postgres healthcheck
# 2. Missing environment variables - check .env file
# 3. Prisma migration failed - run migrations manually
docker-compose exec backend pnpm run prisma:migrate deploy
```

### Database Connection Error

**Symptom**: `Can't reach database server`

**Solutions**:
```bash
# Check if postgres is running
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Verify DATABASE_URL is correct
docker-compose exec backend printenv DATABASE_URL

# Restart postgres
docker-compose restart postgres
```

### Redis Connection Error

**Symptom**: `ECONNREFUSED 127.0.0.1:6379`

**Solutions**:
```bash
# Check if redis is running
docker-compose ps redis

# Test redis connection
docker-compose exec redis redis-cli ping

# Restart redis
docker-compose restart redis
```

### Port Already in Use

**Symptom**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solutions**:
```bash
# Change port in .env
BACKEND_PORT=8080

# Or stop the conflicting service
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Permission Denied

**Symptom**: Permission errors when accessing volumes

**Solutions**:
```bash
# Fix volume permissions
sudo chown -R $USER:$USER ./data

# Or run with sudo (not recommended for production)
sudo docker-compose up -d
```

## Clean Up

```bash
# Stop and remove all containers
docker-compose down

# Remove volumes (WARNING: deletes all data!)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup (containers, volumes, networks, images)
docker-compose down -v --rmi all
docker system prune -a --volumes
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/SteveLaiTVT/solo-guardian/issues
- Documentation: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## License

MIT License
