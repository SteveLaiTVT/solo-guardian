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

## 代码规范遵循
- 无`any`类型
- 所有函数有返回类型
- 函数不超过50行
- Service不直接调用Prisma
- 使用Repository模式

## 待C Session审查
实现报告已创建: `.claude/handoffs/iter-001/IR-001-auth.yaml`

---

# B Session: 后端基础设施搭建 (TASK-000)

## 任务概述
搭建NestJS后端项目基础设施，使现有的认证模块代码可以编译和运行。

## 变更清单

### 新建文件

| 文件路径 | 用途 |
|---------|------|
| `apps/backend/package.json` | NPM包配置和依赖定义 |
| `apps/backend/tsconfig.json` | TypeScript编译配置 |
| `apps/backend/nest-cli.json` | NestJS CLI配置 |
| `apps/backend/src/main.ts` | 应用入口点 |
| `apps/backend/src/app.module.ts` | 根模块配置 |
| `apps/backend/.env.example` | 环境变量模板 |
| `.claude/handoffs/iter-001/IR-000-infrastructure.yaml` | 实现报告 |

### 修改文件

| 文件路径 | 变更内容 |
|---------|---------|
| `auth.repository.ts` | 将路径别名改为相对导入 |

## 依赖包清单

### 生产依赖
```
@nestjs/common: ^10.0.0
@nestjs/config: ^3.0.0
@nestjs/core: ^10.0.0
@nestjs/jwt: ^10.0.0
@nestjs/platform-express: ^10.0.0
@prisma/client: ^5.0.0
bcrypt: ^5.1.0
class-transformer: ^0.5.0
class-validator: ^0.14.0
reflect-metadata: ^0.2.0
rxjs: ^7.8.0
```

### 开发依赖
```
@nestjs/cli: ^10.0.0
@nestjs/schematics: ^10.0.0
@types/bcrypt: ^5.0.0
@types/express: ^4.17.0
@types/node: ^20.0.0
prisma: ^5.0.0
typescript: ^5.0.0
```

## 可用脚本

| 命令 | 用途 |
|------|------|
| `npm run build` | 编译TypeScript |
| `npm run start` | 启动应用 |
| `npm run start:dev` | 开发模式 (热重载) |
| `npm run prisma:generate` | 生成Prisma客户端 |
| `npm run prisma:migrate` | 运行数据库迁移 |

## 环境变量需求
```
DATABASE_URL=postgresql://user:password@localhost:5432/solo_guardian?schema=public
JWT_ACCESS_SECRET=your-access-secret-key-min-32-chars-here
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars-here
PORT=3000
```

## 启动步骤
```bash
cd apps/backend
npm install
cp .env.example .env
# 编辑 .env 配置数据库和密钥
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

## 待C Session审查
实现报告已创建: `.claude/handoffs/iter-001/IR-000-infrastructure.yaml`
