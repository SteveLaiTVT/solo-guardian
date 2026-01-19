# 依赖升级报告 - 2026-01-20

## 升级请求
用户请求将所有项目的 package.json 升级到最新依赖，并接受破坏性变更。

## 升级概要

### 1. Backend (NestJS)

| 包名 | 旧版本 | 新版本 | 备注 |
|------|--------|--------|------|
| @nestjs/common | ^10.x | ^11.0.0 | 主版本升级 |
| @nestjs/core | ^10.x | ^11.0.0 | 主版本升级 |
| @prisma/client | ^6.x | ^7.2.0 | 破坏性变更 |
| prisma | ^6.x | ^7.2.0 | 破坏性变更 |
| bcryptjs | ^2.x | ^3.0.3 | 主版本升级 |
| jest | ^29.x | ^30.0.0 | 主版本升级 |
| @types/jest | ^29.x | ^30.0.0 | 匹配 Jest |

**Prisma 7 破坏性变更处理：**
- 删除 schema.prisma 中的 `url` 属性
- 创建 `prisma.config.mjs` 配置文件（ESM 格式，项目根目录）
- 安装 `@prisma/adapter-pg` 和 `pg` 驱动适配器
- 修改 PrismaService 使用 PrismaPg 适配器
- 测试结果：408 passed, 3 skipped (集成测试需要数据库)

### 2. Admin-web (React + Ant Design)

| 包名 | 旧版本 | 新版本 | 备注 |
|------|--------|--------|------|
| react | ^18.x | ^19.2.0 | 主版本升级 |
| react-dom | ^18.x | ^19.2.0 | 主版本升级 |
| antd | ^5.x | ^6.2.0 | 主版本升级 |
| @ant-design/icons | ^5.x | ^6.1.0 | 主版本升级 |
| @types/react | ^18.x | ^19.2.0 | 匹配 React |
| @types/react-dom | ^18.x | ^19.2.0 | 匹配 React |

### 3. Flutter Mobile App

| 包名 | 旧版本 | 新版本 | 备注 |
|------|--------|--------|------|
| go_router | ^14.x | ^17.0.1 | 主版本升级 |
| connectivity_plus | ^6.x | ^7.0.0 | 破坏性变更 |
| flutter_secure_storage | ^9.x | ^10.0.0 | 主版本升级 |
| flutter_dotenv | ^5.x | ^6.0.0 | 主版本升级 |
| google_sign_in | ^6.x | ^7.2.0 | 主版本升级 |
| sign_in_with_apple | ^6.x | ^7.0.1 | 主版本升级 |
| flutter_lints | ^5.x | ^6.0.0 | 主版本升级 |

**注意：** Riverpod 保持 2.x 版本，因为 Riverpod 3.x 与 Freezed 3.x 存在依赖冲突。

### 4. 其他包

| 项目 | 包名 | 旧版本 | 新版本 |
|------|------|--------|--------|
| packages/types | typescript | ^5.6.x | ^5.9.0 |
| packages/api-client | axios | ^1.7.x | ^1.9.0 |
| e2e | @playwright/test | ^1.49.x | ^1.52.0 |

## 构建和测试结果

| 项目 | 构建状态 | 测试状态 |
|------|----------|----------|
| apps/backend | ✅ 成功 | ✅ 408/411 通过 |
| apps/user-web | ✅ 成功 | N/A |
| apps/admin-web | ✅ 成功 | N/A |
| apps/mobile | ✅ APK 构建成功 | N/A |

## 关键文件变更

1. `apps/backend/prisma/schema.prisma` - 删除 datasource url
2. `apps/backend/prisma.config.mjs` - 新增 Prisma 7 CLI 配置 (ESM 格式，项目根目录)
3. `apps/backend/src/prisma/prisma.service.ts` - 使用 PrismaPg 驱动适配器
4. `apps/backend/src/modules/auth/auth.integration.spec.ts` - 添加 DB 检测跳过
5. `apps/backend/package.json` - 新增 @prisma/adapter-pg 和 pg 依赖
6. `apps/mobile/solo_guardian/pubspec.yaml` - Flutter 依赖升级

## Prisma 7 配置说明

Prisma 7 有重大架构变更，要求使用驱动适配器：

### CLI 配置 (prisma.config.mjs)
```javascript
import { defineConfig } from 'prisma/config';
export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: { url: process.env.DATABASE_URL },
});
```

### 运行时配置 (PrismaService)
```typescript
import { PrismaPg } from '@prisma/adapter-pg';

constructor() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  super({ adapter });
}
```

### 新增依赖
- `@prisma/adapter-pg` - PostgreSQL 驱动适配器
- `pg` - PostgreSQL 客户端库

## 未升级项目

- **Riverpod**: 保持 2.x (3.x 与 Freezed 有冲突)
- **Freezed**: 保持 2.x (3.x 与 Riverpod 有冲突)

## 建议

1. 在有数据库环境时运行集成测试验证 Prisma 7
2. admin-web 的 chunk 较大，建议添加代码分割
3. 未来可考虑升级到 Riverpod 3.x 当依赖冲突解决后
