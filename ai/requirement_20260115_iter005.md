# TASK-008 & TASK-009: 用户端前端基础设施

## TASK-008: User-web 前端项目

### 技术栈
- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 3 + shadcn/ui
- **路由**: React Router v7
- **状态管理**: Zustand
- **数据请求**: TanStack Query v5 + Axios

### 目录结构
```
apps/user-web/src/
├── components/
│   ├── ui/          # shadcn 组件
│   └── layout/      # 布局组件
├── pages/
│   ├── auth/        # 登录、注册
│   ├── dashboard/   # 主页、历史
│   └── settings/    # 设置
├── hooks/           # 自定义 hooks
├── stores/          # Zustand stores
├── lib/             # 工具函数
└── types/           # TypeScript 类型
```

### 路由配置
| 路由 | 页面 | 保护状态 |
|------|------|---------|
| /login | LoginPage | 公开 |
| /register | RegisterPage | 公开 |
| / | DashboardPage | 需登录 |
| /history | HistoryPage | 需登录 |
| /settings | SettingsPage | 需登录 |

### 布局组件
- **Header**: 顶部导航栏，Logo + 用户菜单
- **MobileNav**: 底部导航栏 (移动端)
- **Layout**: 整体布局包装器

## TASK-009: API 客户端包

### 位置
`packages/api-client/`

### 功能
1. **类型定义** (`types.ts`)
   - 用户、认证、签到、设置相关类型
   - 与后端 DTO 对应

2. **Axios 客户端** (`client.ts`)
   - 自动添加 Authorization header
   - 401 响应自动刷新 token
   - 刷新失败调用 onAuthError 回调

3. **API 服务** (`api.ts`)
   - `auth.*` - 登录、注册、刷新、登出
   - `checkIn.*` - 签到、今日状态、历史
   - `settings.*` - 获取、更新设置

4. **React Query Hooks** (`hooks.ts`)
   - `useCheckInToday` - 获取今日状态
   - `useCreateCheckIn` - 创建签到
   - `useSettings` - 获取设置
   - `useLogin`, `useRegister` - 认证

## 构建验证
- `apps/user-web`: `pnpm run build` 成功
- `packages/api-client`: `pnpm run typecheck` 成功
