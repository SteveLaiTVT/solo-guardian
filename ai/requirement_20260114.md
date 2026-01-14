# B Session: 实现认证模块 (Auth Module Implementation)

## 任务概述
填充A Session创建的认证模块骨架代码，实现完整的用户认证功能。

## 变更清单

### 新建文件

| 文件路径 | 用途 |
|---------|------|
| `apps/backend/prisma/schema.prisma` | Prisma数据库模型定义 (User, RefreshToken) |
| `apps/backend/src/prisma/prisma.service.ts` | NestJS的Prisma服务封装 |
| `apps/backend/src/prisma/prisma.module.ts` | 全局Prisma模块 |
| `apps/backend/src/prisma/index.ts` | 模块导出 |
| `apps/backend/src/modules/auth/dto/refresh.dto.ts` | 刷新令牌请求DTO |
| `apps/backend/src/modules/auth/dto/logout.dto.ts` | 登出请求DTO |
| `.claude/handoffs/iter-001/IR-001-auth.yaml` | 实现报告 |

### 修改文件

| 文件路径 | 变更内容 |
|---------|---------|
| `auth.repository.ts` | 实现所有数据库操作方法 |
| `auth.service.ts` | 实现注册、登录、刷新、登出业务逻辑 |
| `auth.module.ts` | 配置JwtModule |
| `auth.controller.ts` | 添加DTO验证 |
| `dto/index.ts` | 导出新增DTO |

## 功能实现详情

### 1. 数据库模型 (Prisma)
- **User模型**: id, email, passwordHash, name, createdAt, updatedAt
- **RefreshToken模型**: id, tokenHash, userId, expiresAt, createdAt
- 使用PostgreSQL数据库

### 2. AuthRepository (数据访问层)
- `findByEmail()`: 根据邮箱查找用户 (不区分大小写)
- `findById()`: 根据ID查找用户 (不返回密码)
- `createUser()`: 创建新用户
- `saveRefreshToken()`: 存储刷新令牌
- `findValidRefreshToken()`: 查找有效的刷新令牌
- `deleteRefreshToken()`: 删除刷新令牌

### 3. AuthService (业务逻辑层)
- `register()`: 用户注册流程
  - 检查邮箱唯一性
  - bcrypt加密密码 (cost factor: 12)
  - 生成JWT令牌对
- `login()`: 用户登录流程
  - 验证邮箱和密码
  - 生成新的令牌对
- `refreshTokens()`: 刷新令牌
  - 验证旧令牌
  - 实现令牌轮换 (删除旧令牌，生成新令牌)
- `logout()`: 用户登出
  - 删除刷新令牌

### 4. 安全措施
- 密码使用bcrypt加密 (cost factor = 12)
- 刷新令牌使用SHA-256哈希后存储
- JWT密钥从环境变量加载
- Access Token有效期: 15分钟
- Refresh Token有效期: 7天
- 实现刷新令牌轮换机制

## 环境变量需求
```
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=your-access-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
```

## 依赖包需求
```
@nestjs/jwt
@nestjs/config
bcrypt
@types/bcrypt
class-validator
class-transformer
```

## 代码规范遵循
- 无`any`类型
- 所有函数有返回类型
- 函数不超过50行
- Service不直接调用Prisma
- 使用Repository模式

## 待C Session审查
实现报告已创建: `.claude/handoffs/iter-001/IR-001-auth.yaml`
