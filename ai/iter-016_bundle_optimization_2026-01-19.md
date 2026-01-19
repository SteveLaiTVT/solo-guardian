# iter-016: 前端包优化 (TASK-101)

## 完成任务

### TASK-101: 减少前端包体积

#### 变更内容

1. **实现路由懒加载**
   - 将所有页面组件改为使用 `React.lazy()` 动态导入
   - 添加 `<Suspense>` 包装器和 `LoadingSpinner` 加载组件
   - 修改的文件:
     - `apps/user-web/src/App.tsx` - 添加 lazy loading
     - `apps/user-web/src/components/ui/loading-spinner.tsx` - 新建加载组件

2. **更新页面组件导出**
   - 所有页面组件从命名导出改为默认导出
   - 更新 index.ts 文件以正确重新导出默认导出
   - 修改的文件:
     - `apps/user-web/src/pages/auth/LoginPage.tsx`
     - `apps/user-web/src/pages/auth/RegisterPage.tsx`
     - `apps/user-web/src/pages/dashboard/DashboardPage.tsx`
     - `apps/user-web/src/pages/dashboard/HistoryPage.tsx`
     - `apps/user-web/src/pages/settings/SettingsPage.tsx`
     - `apps/user-web/src/pages/contacts/ContactsPage.tsx`
     - `apps/user-web/src/pages/contacts/LinkedContactsPage.tsx`
     - `apps/user-web/src/pages/onboarding/OnboardingPage.tsx`
     - `apps/user-web/src/pages/verify-contact/VerifyContactPage.tsx`
     - `apps/user-web/src/pages/accept-invitation/AcceptInvitationPage.tsx`
     - `apps/user-web/src/pages/accept-contact-link/AcceptContactLinkPage.tsx`
     - `apps/user-web/src/pages/caregiver/CaregiverPage.tsx`
     - 所有对应的 index.ts 文件

3. **配置 Vite 代码分割**
   - 添加 `manualChunks` 配置以分离 vendor 库
   - 分割的 chunks:
     - `vendor-react`: react, react-dom, react-router-dom
     - `vendor-query`: @tanstack/react-query
     - `vendor-ui`: @radix-ui/* 组件
     - `vendor-forms`: react-hook-form, @hookform/resolvers, zod
     - `vendor-i18n`: i18next, react-i18next
   - 修改的文件: `apps/user-web/vite.config.ts`

#### 优化效果

**优化前:**
- 主 bundle: ~800KB

**优化后:**
- 主 bundle: ~413KB (减少约 48%)
- 页面组件: 2-40KB (按需加载)
- vendor-react: 48KB
- vendor-query: 36KB
- vendor-ui: 41KB
- vendor-forms: 82KB
- vendor-i18n: 48KB

#### 验证

- [x] TypeScript 编译通过
- [x] ESLint 检查通过
- [x] 生产构建成功
