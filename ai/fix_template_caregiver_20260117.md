# 模板触发规则与看护者API修复

## 日期: 2026-01-17

## 变更内容

### 1. 添加模板触发规则说明 (admin-web)

在邮件/短信模板编辑弹窗中添加了"何时发送"的说明:

| 模板类型 | 触发规则 |
|---------|---------|
| Alert Notification | 用户未签到且超过截止时间时自动发送，系统每分钟检查一次，邮件发送给所有活跃的紧急联系人 |
| Check-in Reminder | 自动发送给启用提醒的用户，在提醒时间和截止时间之间，每天只发送一次 |
| Contact Verification | 用户添加新紧急联系人时发送，包含验证链接 |
| Contact Link Invitation | 当用户添加的紧急联系人邮箱与已注册用户匹配时发送，允许关联账户 |

### 2. 修复看护者API响应格式 (backend)

**问题**: `CaregiverController` 返回 `{ success: true, data: ... }` 格式，与其他控制器不一致

**修复**: 移除响应包装，直接返回数据

```typescript
// 修复前
async getMyCaregivers(): Promise<ApiResponse<CaregiverSummary[]>> {
  const caregivers = await this.caregiverService.getMyCaregivers(user.userId);
  return { success: true, data: caregivers };
}

// 修复后
async getMyCaregivers(): Promise<CaregiverSummary[]> {
  return this.caregiverService.getMyCaregivers(user.userId);
}
```

**影响的端点**:
- `GET /api/v1/caregiver/elders`
- `GET /api/v1/caregiver/caregivers`
- `GET /api/v1/caregiver/elders/:elderId`
- `POST /api/v1/caregiver/invite`
- `POST /api/v1/caregiver/accept`
- `DELETE /api/v1/caregiver/caregivers/:caregiverId`
- `DELETE /api/v1/caregiver/elders/:elderId`
- `POST /api/v1/caregiver/invitations`
- `GET /api/v1/caregiver/invitations/:token`
- `POST /api/v1/caregiver/invitations/:token/accept`
- `POST /api/v1/caregiver/elders/:elderId/check-in`
- `POST /api/v1/caregiver/elders/:elderId/notes`
- `GET /api/v1/caregiver/elders/:elderId/notes`

## 修改的文件

- `apps/admin-web/src/pages/TemplatesPage.tsx` - 添加触发规则信息
- `apps/backend/src/modules/caregiver/caregiver.controller.ts` - 修复响应格式
