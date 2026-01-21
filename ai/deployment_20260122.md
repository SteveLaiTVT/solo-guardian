# 部署 Solo Guardian 到 Railway 和 Vercel

## 变更摘要

### 后端部署 (Railway)
- 在 Railway 创建项目 `solo-guardian-backend`
- 添加 PostgreSQL 和 Redis 服务
- 配置环境变量:
  - DATABASE_URL (PostgreSQL 内部连接)
  - REDIS_URL (Redis 内部连接)
  - JWT_ACCESS_SECRET / JWT_REFRESH_SECRET
  - CORS_ORIGINS
  - Twilio 凭据 (SMS)
- 执行 15 个 Prisma 数据库迁移
- 后端 URL: https://backend-api-production-dbb3.up.railway.app

### 前端部署 (Vercel)
- 更新 VITE_API_URL 指向 Railway 后端
- 重新部署到 Vercel
- 前端 URL: https://solo-guardian.vercel.app

### 代码修复

#### 1. Redis 认证问题
**文件**: `apps/backend/src/modules/queue/queue.module.ts`
**问题**: `parseRedisUrl` 函数未提取 Redis 密码
**修复**: 更新函数以包含 password 和 username

```typescript
// 修复前
function parseRedisUrl(redisUrl: string): { host: string; port: number } {
  const url = new URL(redisUrl);
  return {
    host: url.hostname,
    port: parseInt(url.port, 10) || 6379,
  };
}

// 修复后
function parseRedisUrl(redisUrl: string): { host: string; port: number; password?: string; username?: string } {
  const url = new URL(redisUrl);
  return {
    host: url.hostname,
    port: parseInt(url.port, 10) || 6379,
    ...(url.password && { password: url.password }),
    ...(url.username && url.username !== 'default' && { username: url.username }),
  };
}
```

## 部署架构

```
用户浏览器
    │
    ▼
Vercel (前端)
https://solo-guardian.vercel.app
    │
    ▼ API 请求
Railway (后端)
https://backend-api-production-dbb3.up.railway.app
    │
    ├─► PostgreSQL (数据库)
    │   postgres.railway.internal:5432
    │
    └─► Redis (队列/缓存)
        redis.railway.internal:6379
```

## 验证测试

```bash
# 注册测试 - 成功
curl -X POST https://backend-api-production-dbb3.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"TestPassword123","name":"Test User"}'

# 登录测试 - 成功
curl -X POST https://backend-api-production-dbb3.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"testuser@example.com","password":"TestPassword123"}'
```

## 待处理项

1. 配置 SMTP 服务 (当前 Email 服务连接失败)
2. 考虑添加健康检查端点监控
