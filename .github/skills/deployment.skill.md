# Deployment Skill

This skill provides expertise in deployment for Solo Guardian.

## When to Use This Skill

Use this skill when working on:
- Backend deployment (Railway, Vercel)
- Frontend deployment (Vercel)
- Mobile app deployment (Google Play, App Store)
- Environment configuration
- CI/CD pipelines
- Database migrations
- Production troubleshooting

## Deployment Targets

| Component | Platform | URL |
|-----------|----------|-----|
| Backend API | Railway / Vercel | Production URL |
| User Web | Vercel | Production URL |
| Admin Web | Vercel | Production URL |
| Mobile (Android) | Google Play | Play Store |
| Mobile (iOS) | App Store | App Store |
| Database | Railway PostgreSQL | Private |
| Redis | Railway Redis | Private |

## Backend Deployment

### Railway Deployment

1. **Prerequisites**
   - Railway account
   - GitHub repository connected

2. **Environment Variables**
   ```bash
   DATABASE_URL=postgresql://...
   REDIS_URL=redis://...
   JWT_ACCESS_SECRET=...
   JWT_REFRESH_SECRET=...
   SMTP_HOST=...
   SMTP_PORT=...
   SMTP_USER=...
   SMTP_PASS=...
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=...
   NODE_ENV=production
   PORT=3000
   ```

3. **Build Configuration**
   ```json
   // package.json
   {
     "scripts": {
       "build": "cd apps/backend && pnpm run build",
       "start": "cd apps/backend && node dist/main.js"
     }
   }
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   cd apps/backend
   pnpm run prisma:migrate deploy
   
   # Generate Prisma client
   pnpm run prisma:generate
   ```

### Vercel Deployment

1. **vercel.json Configuration**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "apps/backend/dist/main.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/v1/(.*)",
         "dest": "apps/backend/dist/main.js"
       }
     ]
   }
   ```

2. **Environment Variables**
   - Set in Vercel dashboard
   - Use Vercel CLI: `vercel env add`

3. **Build Command**
   ```bash
   pnpm install && cd apps/backend && pnpm run build && pnpm run prisma:generate
   ```

### Health Check

```typescript
// apps/backend/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
```

Test: `curl https://api.example.com/health`

## Frontend Deployment

### Vercel (Recommended)

1. **User Web Configuration**
   ```json
   // apps/user-web/vercel.json
   {
     "buildCommand": "pnpm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "env": {
       "VITE_API_URL": "https://api.example.com"
     }
   }
   ```

2. **Admin Web Configuration**
   ```json
   // apps/admin-web/vercel.json
   {
     "buildCommand": "pnpm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "env": {
       "VITE_API_URL": "https://api.example.com"
     }
   }
   ```

3. **Environment Variables**
   ```bash
   VITE_API_URL=https://api.example.com/api/v1
   VITE_GOOGLE_CLIENT_ID=...
   VITE_APPLE_CLIENT_ID=...
   ```

4. **Deploy Commands**
   ```bash
   # Install Vercel CLI
   pnpm add -g vercel

   # Login
   vercel login

   # Deploy user web
   cd apps/user-web
   vercel --prod

   # Deploy admin web
   cd apps/admin-web
   vercel --prod
   ```

### Custom Domain

1. **Add domain in Vercel**
   - Go to project settings
   - Add custom domain
   - Update DNS records

2. **SSL Certificate**
   - Automatically provisioned by Vercel
   - Force HTTPS in settings

## Mobile Deployment

### Android (Google Play)

1. **Build Release APK**
   ```bash
   cd apps/mobile/solo_guardian
   flutter build apk --release
   ```

2. **Build App Bundle (Recommended)**
   ```bash
   flutter build appbundle --release
   ```

3. **Signing Configuration**
   ```properties
   # android/key.properties
   storePassword=<password>
   keyPassword=<password>
   keyAlias=upload
   storeFile=<path-to-keystore>
   ```

4. **Version Management**
   ```yaml
   # pubspec.yaml
   version: 1.0.0+1  # version name + build number
   ```

5. **Upload to Play Console**
   - Internal testing → Closed testing → Open testing → Production
   - Fill store listing
   - Upload screenshots
   - Submit for review

### iOS (App Store)

1. **Prerequisites**
   - Apple Developer account ($99/year)
   - macOS with Xcode

2. **Build Release**
   ```bash
   cd apps/mobile/solo_guardian
   flutter build ios --release
   ```

3. **Archive with Xcode**
   - Open `ios/Runner.xcworkspace` in Xcode
   - Product → Archive
   - Distribute App → App Store Connect

4. **Version Management**
   ```yaml
   # pubspec.yaml
   version: 1.0.0+1  # CFBundleShortVersionString + CFBundleVersion
   ```

5. **Upload to App Store Connect**
   - Create app in App Store Connect
   - Upload build via Xcode
   - Fill app information
   - Submit for review

### Code Signing

**Android**:
```bash
# Generate keystore
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload

# Store keystore safely (not in repo!)
```

**iOS**:
- Managed through Xcode
- Use automatic signing for simplicity
- Or manual signing with certificates

## Database Migrations

### Production Migration Workflow

1. **Test Locally**
   ```bash
   cd apps/backend
   pnpm run prisma:migrate dev --name migration_name
   ```

2. **Review Generated SQL**
   ```bash
   cat prisma/migrations/*/migration.sql
   ```

3. **Deploy to Production**
   ```bash
   pnpm run prisma:migrate deploy
   ```

4. **Rollback (if needed)**
   ```bash
   # Prisma doesn't support automatic rollback
   # Manually write and run rollback SQL
   ```

### Migration Best Practices

- ✅ Always test migrations locally first
- ✅ Backup database before production migration
- ✅ Use transactions for data migrations
- ✅ Keep migrations small and focused
- ❌ Don't edit existing migrations
- ❌ Don't delete migrations

## CI/CD Pipeline

### GitHub Actions (E2E Tests)

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run E2E tests
        run: cd e2e && pnpm run test
```

### Backend CI

```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: cd apps/backend && pnpm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
```

## Monitoring & Logging

### Backend Logging

```typescript
// Use NestJS Logger
import { Logger } from '@nestjs/common';

export class CheckInService {
  private readonly logger = new Logger(CheckInService.name);

  async checkIn(userId: string): Promise<void> {
    this.logger.log(`User ${userId} checking in`);
    try {
      // Check-in logic
      this.logger.log(`User ${userId} checked in successfully`);
    } catch (error) {
      this.logger.error(`Check-in failed for user ${userId}`, error.stack);
      throw error;
    }
  }
}
```

### Production Monitoring

- **Railway**: Built-in logs and metrics
- **Vercel**: Deployment logs and analytics
- **Sentry**: Error tracking (optional)
- **LogRocket**: Session replay (optional)

### Health Monitoring

```bash
# Set up uptime monitoring
# Use services like:
# - UptimeRobot
# - Pingdom
# - StatusCake

# Monitor endpoints:
# - https://api.example.com/health
# - https://app.example.com
```

## Environment Management

### Development
```bash
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/solo_guardian_dev
REDIS_URL=redis://localhost:6379
```

### Staging (optional)
```bash
NODE_ENV=staging
DATABASE_URL=<staging-db-url>
REDIS_URL=<staging-redis-url>
```

### Production
```bash
NODE_ENV=production
DATABASE_URL=<production-db-url>
REDIS_URL=<production-redis-url>
# All secrets must be set
```

## Secrets Management

1. **Never commit secrets**
   - Add `.env` to `.gitignore`
   - Use `.env.example` as template

2. **Use platform secret managers**
   - Railway: Environment Variables
   - Vercel: Environment Variables
   - GitHub: Secrets for Actions

3. **Rotate secrets regularly**
   - JWT secrets every 90 days
   - API keys when compromised
   - Database passwords quarterly

## Rollback Procedures

### Backend Rollback

1. **Railway**
   - Go to deployments
   - Select previous deployment
   - Click "Redeploy"

2. **Vercel**
   - Go to deployments
   - Select previous deployment
   - Click "Promote to Production"

### Mobile Rollback

1. **Android**
   - Play Console → Release Management
   - Promote previous version
   - Halt rollout of new version

2. **iOS**
   - Cannot rollback directly
   - Submit new version with fixes
   - Or remove from sale temporarily

### Database Rollback

```bash
# No automatic rollback in Prisma
# Manually restore from backup

# Restore backup
pg_restore -d solo_guardian backup.sql

# Or rollback changes with SQL
psql -d solo_guardian -f rollback.sql
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   pnpm store prune
   
   # Reinstall dependencies
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **Migration Failures**
   ```bash
   # Reset database (dev only!)
   pnpm run prisma:migrate reset
   
   # Force deploy
   pnpm run prisma:migrate deploy --force
   ```

3. **Out of Memory**
   ```json
   // package.json
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
     }
   }
   ```

### Production Debugging

1. **Check Logs**
   ```bash
   # Railway
   railway logs
   
   # Vercel
   vercel logs
   ```

2. **Database Connection**
   ```bash
   # Test connection
   psql $DATABASE_URL
   ```

3. **Health Check**
   ```bash
   curl https://api.example.com/health
   ```

## Performance Optimization

1. **Enable Caching**
   - Redis for session storage
   - CDN for static assets

2. **Database Optimization**
   - Add indexes for common queries
   - Use connection pooling
   - Enable query logging in dev

3. **Bundle Optimization**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             ui: ['@radix-ui/react-dialog', ...],
           },
         },
       },
     },
   });
   ```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevention (sanitize inputs)
- [ ] CSRF protection
- [ ] Secrets rotated regularly
- [ ] Dependencies updated
- [ ] Security headers configured

## Related Files

- `DEPLOYMENT.md` - Detailed deployment guide
- `.github/workflows/` - CI/CD pipelines
- `vercel.json` - Vercel configuration
- `nixpacks.toml` - Railway configuration
- `AGENTS.md` - Full architecture guide
