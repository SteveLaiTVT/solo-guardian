# TASK-016: 紧急联系人前端页面骨架代码

## 变更摘要

**日期**: 2026-01-15
**版本**: 1.4.1 → 1.4.2
**任务**: TASK-015 完成, TASK-016 进行中

## 状态更新

| 任务 | 状态变更 |
|------|----------|
| TASK-015 | in_progress → completed |
| TASK-016 | pending → in_progress |

## 创建/修改的文件

### API Client (packages/api-client)
- `src/types.ts` - 添加 EmergencyContact 类型
- `src/api.ts` - 添加 contacts API 方法
- `src/hooks.ts` - 添加 contacts React Query hooks

### 前端组件 (apps/user-web)

#### 新建文件
- `src/pages/contacts/ContactsPage.tsx` - 联系人主页面
- `src/pages/contacts/index.ts` - 页面导出
- `src/components/contacts/ContactCard.tsx` - 联系人卡片
- `src/components/contacts/ContactForm.tsx` - 添加/编辑表单对话框
- `src/components/contacts/DeleteContactDialog.tsx` - 删除确认对话框
- `src/components/contacts/index.ts` - 组件导出
- `src/components/ui/dialog.tsx` - Dialog 组件 (shadcn/ui)

#### i18n 翻译
- `src/i18n/locales/en/contacts.json` - 英文翻译
- `src/i18n/locales/zh/contacts.json` - 中文翻译
- `src/i18n/locales/ja/contacts.json` - 日文翻译

#### 修改文件
- `src/App.tsx` - 添加 /contacts 路由
- `src/components/layout/Header.tsx` - 添加联系人导航按钮
- `src/components/layout/MobileNav.tsx` - 添加联系人导航项
- `src/i18n/index.ts` - 添加 contacts 命名空间
- `src/i18n/locales/*/common.json` - 添加 nav.contacts 和 delete

## API Hooks 添加

```typescript
// 新增 hooks
hooks.useContacts()        // 获取所有联系人
hooks.useCreateContact()   // 创建联系人
hooks.useUpdateContact()   // 更新联系人
hooks.useDeleteContact()   // 删除联系人
hooks.useReorderContacts() // 重排序联系人
```

## B Session 任务

所有组件已包含 TODO(B) 标记，主要需要:

### ContactsPage
- 显示联系人列表
- 添加按钮 (5人限制时禁用)
- 空状态展示
- 加载/错误状态

### ContactCard
- 显示优先级徽章
- 显示联系人信息
- 编辑/删除按钮

### ContactForm
- 表单验证
- 创建/更新逻辑
- 成功后关闭

### DeleteContactDialog
- 确认消息
- 删除操作

## 验收标准

- 联系人页面可通过 /contacts 访问
- Header 和 MobileNav 中有导航链接
- 可添加/编辑/删除联系人
- 显示计数指示器 (x/5)
- 5个联系人时禁用添加按钮
- 无联系人时显示空状态
- 所有文本使用 i18n (en, zh, ja)
- 移动端响应式布局
