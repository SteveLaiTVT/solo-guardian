# TASK-015: 紧急联系人后端模块骨架代码

## 变更摘要

**日期**: 2026-01-15
**版本**: 1.4.0 → 1.4.1
**任务**: TASK-014 完成, TASK-015 进行中

## 状态更新

| 任务 | 状态变更 |
|------|----------|
| TASK-014 | pending → completed |
| TASK-015 | pending → in_progress |

## 创建的骨架文件

### 模块文件
- `apps/backend/src/modules/emergency-contacts/emergency-contacts.module.ts`
- `apps/backend/src/modules/emergency-contacts/emergency-contacts.controller.ts`
- `apps/backend/src/modules/emergency-contacts/emergency-contacts.service.ts`
- `apps/backend/src/modules/emergency-contacts/emergency-contacts.repository.ts`

### DTO 文件
- `apps/backend/src/modules/emergency-contacts/dto/create-contact.dto.ts`
- `apps/backend/src/modules/emergency-contacts/dto/update-contact.dto.ts`
- `apps/backend/src/modules/emergency-contacts/dto/contact-response.dto.ts`
- `apps/backend/src/modules/emergency-contacts/dto/reorder-contacts.dto.ts`
- `apps/backend/src/modules/emergency-contacts/dto/index.ts`

### 修改的文件
- `apps/backend/src/app.module.ts` - 注册 EmergencyContactsModule

## API 端点 (带 TODO 标记)

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/v1/emergency-contacts | 获取所有联系人 |
| GET | /api/v1/emergency-contacts/:id | 获取单个联系人 |
| POST | /api/v1/emergency-contacts | 创建联系人 |
| PUT | /api/v1/emergency-contacts/:id | 更新联系人 |
| DELETE | /api/v1/emergency-contacts/:id | 软删除联系人 |
| PUT | /api/v1/emergency-contacts/reorder | 重排序联系人 |

## B Session 任务

所有方法已包含 TODO(B) 标记，需要填充以下实现:

### Controller
- findAll - 获取所有联系人
- findOne - 获取单个联系人
- create - 创建联系人
- update - 更新联系人
- remove - 软删除联系人
- reorder - 重排序联系人

### Service
- findAll - 业务逻辑
- findOne - 业务逻辑
- create - 包含限制检查和邮箱唯一性验证
- update - 包含邮箱唯一性验证
- remove - 软删除逻辑
- reorder - 批量更新优先级

### Repository
- findAllByUserId - 查询用户所有联系人
- findById - 按 ID 查询
- findByEmail - 按邮箱查询
- countByUserId - 统计联系人数量
- create - 创建联系人
- update - 更新联系人
- softDelete - 软删除
- updatePriorities - 批量更新优先级

## 验收标准

- 所有 6 个 API 端点正常工作
- JwtAuthGuard 保护所有端点
- 不能添加超过 5 个联系人
- 不能添加重复邮箱
- 删除是软删除 (设置 deletedAt)
- 查询排除已删除联系人
