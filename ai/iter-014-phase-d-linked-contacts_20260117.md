# iter-014 Phase D: 关联紧急联系人功能实现

## 任务概述

实现了Phase D: Linked Emergency Contacts (关联紧急联系人) 功能，允许紧急联系人与系统中的注册用户关联，使他们能够查看紧急警报。

## 完成的任务 (TASK-065 ~ TASK-074)

| 任务 | 描述 | 状态 |
|------|------|------|
| TASK-065 | 数据库：扩展 EmergencyContact 添加 linkedUserId、邀请字段 | ✅ 完成 |
| TASK-066 | 后端：创建/更新联系人时检查匹配用户 | ✅ 完成 |
| TASK-067 | 后端：向关联用户发送邀请邮件 | ✅ 完成 |
| TASK-068 | 后端：接受联系人关联邀请端点 | ✅ 完成 |
| TASK-069 | 后端：获取我被添加为紧急联系人的列表 | ✅ 完成 |
| TASK-070 | 后端：获取关联联系人的紧急警报 | ✅ 完成 |
| TASK-071 | 用户网页：联系人列表显示关联状态徽章 | ✅ 完成 |
| TASK-072 | 用户网页：查看"将我添加为联系人的人"页面 | ✅ 完成 |
| TASK-073 | 用户网页：接受邀请页面 | ✅ 完成 |
| TASK-074 | 国际化：添加关联联系人翻译 (en/zh/ja) | ✅ 完成 |

## 修改的文件

### 数据库层
- `apps/backend/prisma/schema.prisma` - 添加 linkedUserId、invitationToken、invitationSentAt、invitationAcceptedAt 字段
- `apps/backend/prisma/migrations/20260117160400_add_linked_contact_fields/migration.sql` - 迁移文件

### 后端
- `apps/backend/src/modules/emergency-contacts/dto/contact-response.dto.ts` - 添加关联用户字段
- `apps/backend/src/modules/emergency-contacts/emergency-contacts.repository.ts` - 添加关联用户查询方法
- `apps/backend/src/modules/emergency-contacts/emergency-contacts.service.ts` - 添加关联逻辑和新方法
- `apps/backend/src/modules/emergency-contacts/emergency-contacts.controller.ts` - 添加新 API 端点
- `apps/backend/src/modules/emergency-contacts/emergency-contacts.module.ts` - 更新模块依赖
- `apps/backend/src/modules/emergency-contacts/contact-verification.service.ts` - 更新 mapToResponse
- `apps/backend/src/modules/emergency-contacts/phone-verification.service.ts` - 更新 mapToResponse
- `apps/backend/src/modules/email/email.service.ts` - 添加发送关联邀请邮件方法
- `apps/backend/src/modules/alerts/alert.service.ts` - 添加获取活跃警报方法
- `apps/backend/src/modules/alerts/alert.repository.ts` - 添加按用户ID查询活跃警报

### API 客户端
- `packages/api-client/src/types.ts` - 添加关联联系人类型定义
- `packages/api-client/src/api.ts` - 添加 API 方法
- `packages/api-client/src/hooks.ts` - 添加 React Query hooks

### 前端
- `apps/user-web/src/components/contacts/ContactCard.tsx` - 添加关联状态徽章
- `apps/user-web/src/pages/contacts/LinkedContactsPage.tsx` - 新页面：查看关联的联系人
- `apps/user-web/src/pages/contacts/index.ts` - 导出新页面
- `apps/user-web/src/pages/accept-contact-link/AcceptContactLinkPage.tsx` - 新页面：接受邀请
- `apps/user-web/src/pages/accept-contact-link/index.ts` - 导出新页面
- `apps/user-web/src/App.tsx` - 添加新路由

### 国际化
- `apps/user-web/src/i18n/locales/en/contacts.json` - 英语翻译
- `apps/user-web/src/i18n/locales/zh/contacts.json` - 中文翻译
- `apps/user-web/src/i18n/locales/ja/contacts.json` - 日语翻译

## 新增 API 端点

```
GET  /api/v1/emergency-contacts/linked           - 获取我被添加为紧急联系人的列表
GET  /api/v1/emergency-contacts/linked/pending   - 获取待处理的邀请
GET  /api/v1/contact-link/:token                 - 获取邀请详情（公开）
POST /api/v1/contact-link/:token/accept          - 接受关联邀请
```

## 功能流程

```
用户A 创建 EmergencyContact，邮箱为 "bob@example.com"
                    ↓
        系统检查：bob@example.com 是否存在于 Users 表？
                    ↓
    ┌───────────────┴───────────────┐
    ↓                               ↓
  是（用户B存在）                否（未注册）
    ↓                               ↓
  生成 invitationToken           仅保存联系人
  发送邀请邮件                    （正常流程）
  设置 invitationSentAt
    ↓
  用户B 点击链接
    ↓
  系统设置 linkedUserId = 用户B的ID
  系统设置 invitationAcceptedAt
    ↓
  用户B 现在可以：
  - 看到 "用户A 将我添加为紧急联系人"
  - 查看用户A的紧急警报（如果有）
```

## 构建验证

- ✅ 后端构建成功
- ✅ 前端构建成功
- ✅ API 客户端类型检查通过

## 注意事项

1. 使用 `forwardRef` 解决 AlertService 和 EmergencyContactsService 之间的循环依赖
2. 邀请令牌为32字符随机字符串，默认7天过期
3. 只有已接受邀请的关联联系人才能查看警报
4. 前端使用 `Intl.DateTimeFormat` 替代 `date-fns` 进行日期格式化，避免添加额外依赖
