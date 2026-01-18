# Flutter 移动端后端支持更新 - 2026-01-18

## 变更摘要

本次更新主要为 Flutter 移动应用提供后端支持，包括迁移修复、存储服务和头像上传功能。

---

## 1. 数据库迁移顺序修复

### 问题
- 迁移 `20260117070201_iter014_templates_invitations_notes` 尝试修改 `caregiver_relations` 表
- 但创建该表的迁移 `20260117_add_rbac_caregiver` 由于命名问题，在字母排序中排在后面
- 导致 `prisma migrate dev` 失败，错误：`The underlying table for model 'caregiver_relations' does not exist`

### 解决方案
- 将迁移文件夹从 `20260117_add_rbac_caregiver` 重命名为 `20260117060000_add_rbac_caregiver`
- 确保正确的执行顺序：
  1. `20260117060000_add_rbac_caregiver` - 创建 `caregiver_relations` 表
  2. `20260117070201_iter014_templates_invitations_notes` - 修改 `caregiver_relations` 表

---

## 2. 阿里云 OSS 存储服务集成

### 新增文件
- `apps/backend/src/modules/storage/storage.service.ts` - 存储服务实现
- `apps/backend/src/modules/storage/storage.module.ts` - 模块配置
- `apps/backend/src/modules/storage/index.ts` - 导出文件

### 功能特性
- 支持阿里云 OSS 作为文件存储后端
- 头像上传功能，自动生成唯一文件名
- 支持 CDN 域名配置
- 配置缺失时优雅降级（返回 false 而不是崩溃）

### 配置项（.env.example）
```
ALIYUN_OSS_REGION="oss-cn-hangzhou"
ALIYUN_OSS_ACCESS_KEY_ID="your-access-key-id"
ALIYUN_OSS_ACCESS_KEY_SECRET="your-access-key-secret"
ALIYUN_OSS_BUCKET="your-bucket-name"
ALIYUN_OSS_ENDPOINT="https://oss-cn-hangzhou.aliyuncs.com"
ALIYUN_OSS_CDN_DOMAIN=""
```

### 依赖项
- `ali-oss: ^6.20.0`
- `@types/ali-oss: ^6.16.0`

---

## 3. 用户头像功能

### 数据库变更
- `User` 模型新增 `avatar` 字段（String?）- 存储 OSS 中的头像 URL

### API 变更

#### 新增端点
- `POST /api/v1/user-preferences/profile/avatar` - 上传头像

#### 修改端点
- `GET /api/v1/user-preferences/profile` - 响应中包含 `avatar` 字段
- `PUT /api/v1/user-preferences/profile` - 响应中包含 `avatar` 字段

### 文件上传限制
- 最大文件大小：5MB
- 支持格式：JPEG、PNG、GIF、WebP

### 修改文件
- `apps/backend/prisma/schema.prisma` - 添加 avatar 字段
- `apps/backend/src/modules/user-preferences/dto/update-profile.dto.ts`
- `apps/backend/src/modules/user-preferences/user-preferences.controller.ts`
- `apps/backend/src/modules/user-preferences/user-preferences.repository.ts`
- `apps/backend/src/modules/user-preferences/user-preferences.service.ts`

---

## 4. CORS 配置更新

### 变更
- 添加移动开发 IP `192.168.1.105:5173` 到 CORS 允许列表
- 支持 Flutter 移动应用在本地网络中访问后端 API

### 文件
- `apps/backend/src/main.ts`

---

## 提交分组

1. **fix(migration)**: 修复迁移顺序，确保 caregiver_relations 表正确创建
2. **feat(storage)**: 添加阿里云 OSS 存储服务集成
3. **feat(avatar)**: 添加用户头像上传功能
