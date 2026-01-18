# 可选标识符注册 - 变更记录

## 需求变更

用户要求修改注册逻辑：如果用户未提供任何登录标识符（用户名、邮箱、手机号），仅显示确认对话框提醒用户，用户确认后仍可完成注册。

## 变更列表

### 后端变更

#### 修改文件
- `apps/backend/src/modules/auth/dto/register.dto.ts`: 移除 `@AtLeastOneIdentifier()` 验证器装饰器

### 前端变更

#### 新增文件
- `apps/user-web/src/components/ui/alert-dialog.tsx`: 添加 AlertDialog 组件（shadcn/ui 风格）

#### 修改文件
- `apps/user-web/src/components/ui/button.tsx`: 导出 `buttonVariants`
- `apps/user-web/src/pages/auth/RegisterPage.tsx`:
  - 添加确认对话框状态管理 (`showNoIdentifierDialog`, `pendingData`)
  - 添加 `hasAnyIdentifier` 函数检测是否有任何标识符
  - 修改 `onSubmit` 逻辑，无标识符时显示确认对话框
  - 添加 AlertDialog 组件展示确认对话框

### 国际化变更

#### 新增翻译键
- `i18n/locales/en/auth.json`:
  - `register.identifiersHintOptional`: "Optional - You can add these later"
  - `register.noIdentifierTitle`: "No Login Identifier"
  - `register.noIdentifierDescription`: 确认说明
  - `register.noIdentifierCancel`: "Go back"
  - `register.noIdentifierConfirm`: "Continue anyway"

- `i18n/locales/zh/auth.json`:
  - `register.identifiersHintOptional`: "可选 - 您可以稍后添加"
  - `register.noIdentifierTitle`: "未设置登录标识"
  - `register.noIdentifierDescription`: 确认说明
  - `register.noIdentifierCancel`: "返回"
  - `register.noIdentifierConfirm`: "仍然继续"

- `i18n/locales/ja/auth.json`:
  - `register.identifiersHintOptional`: "任意 - 後で追加できます"
  - `register.noIdentifierTitle`: "ログイン識別子が未設定"
  - `register.noIdentifierDescription`: 确认说明
  - `register.noIdentifierCancel`: "戻る"
  - `register.noIdentifierConfirm`: "このまま続ける"

### 依赖更新
- `apps/user-web/package.json`: 添加 `@radix-ui/react-alert-dialog ^1.1.15`

## 用户流程

1. 用户填写姓名和密码（必填）
2. 标识符部分（用户名/邮箱/手机号）均为可选
3. 如果用户未填写任何标识符，点击提交时：
   - 显示确认对话框，告知用户只能通过用户ID登录
   - 用户可选择"返回"继续填写，或"仍然继续"直接注册
4. 如果用户填写了至少一个标识符，直接完成注册

## 验证清单

- [x] 后端编译成功
- [x] 前端编译成功
- [ ] 测试：无标识符注册显示确认对话框
- [ ] 测试：确认后可完成注册
- [ ] 测试：取消后返回表单
- [ ] 测试：有标识符注册直接完成
