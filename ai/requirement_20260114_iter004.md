# TASK-007: JWT Auth Guard 实现

## 实现内容

### 新增依赖
- `@nestjs/passport` - NestJS Passport 集成
- `passport` - 认证框架
- `passport-jwt` - JWT 策略
- `@types/passport-jwt` - TypeScript 类型

### 新增文件

#### 1. JwtStrategy (strategies/jwt.strategy.ts)
- 从 Bearer token 提取 JWT
- 验证 token 签名和过期时间
- 将 `payload.sub` 转换为 `userId`

#### 2. JwtAuthGuard (guards/jwt-auth.guard.ts)
- 继承 Passport AuthGuard
- 自动返回 401 Unauthorized

#### 3. CurrentUser 装饰器 (decorators/current-user.decorator.ts)
- 从 request.user 提取 userId
- 用于 Controller 方法参数

### 修改文件

#### AuthModule
- 导入 PassportModule
- 注册 JwtStrategy provider
- 导出 JwtAuthGuard

#### CheckInController
- 添加 @UseGuards(JwtAuthGuard) 类级别装饰器
- 所有方法使用 @CurrentUser() userId: string
- 移除硬编码的 'TODO-REPLACE-WITH-AUTH'

## API 保护状态

| 端点 | 保护状态 |
|------|---------|
| POST /api/v1/auth/register | 公开 |
| POST /api/v1/auth/login | 公开 |
| POST /api/v1/auth/refresh | 公开 |
| POST /api/v1/auth/logout | 公开 |
| POST /api/v1/check-ins | 需要 JWT |
| GET /api/v1/check-ins/today | 需要 JWT |
| GET /api/v1/check-ins | 需要 JWT |
| GET /api/v1/check-in-settings | 需要 JWT |
| PUT /api/v1/check-in-settings | 需要 JWT |

## 测试方法

```bash
# 无 token 访问 (应返回 401)
curl -X GET http://localhost:3000/api/v1/check-ins/today

# 有 token 访问 (应返回 200)
curl -X GET http://localhost:3000/api/v1/check-ins/today \
  -H "Authorization: Bearer <access_token>"
```

## 构建验证
- `npm run build` 成功通过
