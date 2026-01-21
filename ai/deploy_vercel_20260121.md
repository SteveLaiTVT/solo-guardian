# 部署应用到 Vercel

## 日期
2026-01-21

## 问题描述
用户需要将应用部署到 Vercel

## 变更内容

### 1. 修复 TypeScript 错误
**文件:** `packages/api-client/src/error-handler.ts`

修复了第78行的类型错误，`error.response.status` 类型为 `number | undefined`，但 `parseHttpStatus` 函数期望 `number` 类型。

```typescript
// 修复前
const status = error.response.status;
const statusError = parseHttpStatus(status);

// 修复后
const status = error.response.status;
if (status !== undefined) {
  const statusError = parseHttpStatus(status);
  if (statusError) {
    return statusError;
  }
}
```

### 2. 创建 .vercelignore 文件
排除不必要的文件以减少上传大小：
- node_modules/
- .git/
- apps/backend/
- apps/admin-web/
- apps/mobile/
- 临时文件和缓存

### 3. 更新 vercel.json 构建命令
**文件:** `vercel.json`

更新构建命令以先构建依赖包：
```json
{
  "buildCommand": "pnpm --filter @solo-guardian/types build && pnpm --filter @solo-guardian/api-client build && cd apps/user-web && pnpm run build"
}
```

## 部署结果
- **生产环境 URL:** https://solo-guardian.vercel.app
- **检查 URL:** https://vercel.com/stevelaitvts-projects/solo-guardian

## 注意事项
- 当前只部署了前端 (user-web)
- 后端需要单独部署到支持 Node.js 的服务 (如 Railway, Render, Fly.io 等)
