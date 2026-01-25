# Solo Guardian Docker 部署快速指南

## 📋 概述

本项目现已支持 Docker Compose 一键部署，包含以下服务：
- 🐘 PostgreSQL 16 数据库
- 🔴 Redis 7 消息队列
- 🚀 NestJS 后端 API

## 🚀 快速开始

### 1️⃣ 配置环境变量

```bash
# 复制环境变量模板
cp .env.docker .env

# 编辑 .env 文件，配置以下必需项：
# - JWT_ACCESS_SECRET (生成命令: openssl rand -base64 32)
# - JWT_REFRESH_SECRET (生成命令: openssl rand -base64 32)
# - SMTP_HOST, SMTP_USER, SMTP_PASS (邮件通知)
# - TWILIO_* (短信通知，可选)
```

### 2️⃣ 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps
```

### 3️⃣ 验证部署

```bash
# 测试 API 健康检查
curl http://localhost:3000/api/health

# 预期响应:
# {"status":"ok","timestamp":"2024-01-20T12:00:00.000Z"}
```

## 🎯 端口配置

所有端口都可以通过环境变量自定义：

| 服务 | 默认端口 | 环境变量 |
|------|---------|----------|
| 后端 API | 3000 | `BACKEND_PORT` |
| PostgreSQL | 5432 | `POSTGRES_PORT` |
| Redis | 6379 | `REDIS_PORT` |

**示例：修改端口**
```bash
# 在 .env 文件中设置：
BACKEND_PORT=8080
POSTGRES_PORT=5433
REDIS_PORT=6380
```

## 🌐 Vercel 前端部署

### 1. 部署后端（使用 Docker）

在你的 VPS 或云服务器上：

```bash
# 启动 Docker 服务
docker-compose up -d

# 获取你的服务器 IP 或域名
# 例如: http://123.456.789.0:3000 或 https://api.yourdomain.com
```

### 2. 部署前端到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/new)
2. 导入 GitHub 仓库
3. 配置环境变量：
   ```
   VITE_API_URL=http://你的后端地址:3000
   ```
4. 点击 Deploy

### 3. 更新后端 CORS

在你的 `.env` 文件中添加 Vercel 域名：

```bash
CORS_ORIGINS=https://your-app.vercel.app,https://www.your-app.vercel.app
```

重启后端服务：
```bash
docker-compose restart backend
```

## 📝 常用命令

### 服务管理

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 仅重启后端
docker-compose restart backend

# 查看日志
docker-compose logs -f backend
```

### 数据库管理

```bash
# 进入 PostgreSQL
docker-compose exec postgres psql -U solo_guardian -d solo_guardian

# 备份数据库
docker-compose exec postgres pg_dump -U solo_guardian solo_guardian > backup.sql

# 恢复数据库
cat backup.sql | docker-compose exec -T postgres psql -U solo_guardian -d solo_guardian
```

### Redis 管理

```bash
# 进入 Redis CLI
docker-compose exec redis redis-cli

# 测试 Redis 连接
docker-compose exec redis redis-cli ping
# 应返回: PONG
```

## 🔒 安全检查清单

- [ ] 已生成强 JWT 密钥（至少 32 字符）
- [ ] 已设置复杂的数据库密码
- [ ] 已配置正确的 CORS 域名
- [ ] 已启用 HTTPS（生产环境）
- [ ] 已定期备份数据库
- [ ] 未在代码中提交 `.env` 文件

## 📖 详细文档

- [DOCKER.md](./DOCKER.md) - 完整 Docker 部署指南
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 所有部署选项
- [README.md](./README.md) - 项目说明

## 🆘 故障排除

### 问题：后端无法启动

```bash
# 查看日志
docker-compose logs backend

# 常见原因：
# 1. 数据库未就绪 - 等待 postgres 健康检查
# 2. 缺少环境变量 - 检查 .env 文件
# 3. Prisma 迁移失败 - 手动运行迁移
docker-compose exec backend npx prisma migrate deploy
```

### 问题：前端无法连接后端

**解决方案：**
1. 确认 Vercel 的 `VITE_API_URL` 配置正确
2. 确认后端的 `CORS_ORIGINS` 包含 Vercel 域名
3. 确认后端服务正在运行且可访问

### 问题：端口已被占用

```bash
# 修改 .env 中的端口
BACKEND_PORT=8080

# 或停止占用端口的服务
sudo lsof -i :3000
sudo kill -9 <PID>
```

## 💡 提示

1. **自动测试脚本**
   ```bash
   ./test-docker.sh
   ```
   这个脚本会自动检查环境并启动服务。

2. **查看完整环境变量**
   参考 `.env.docker` 文件，包含所有可配置选项。

3. **生成强密钥**
   ```bash
   openssl rand -base64 32
   ```

---

**祝部署顺利！** 🎉

如有问题，请参考 [DOCKER.md](./DOCKER.md) 或提交 Issue。
