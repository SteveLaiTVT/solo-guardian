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

---

# TASK-010 & TASK-011: 用户端前端页面

## TASK-010: 认证页面

### 文件清单
- `src/stores/auth.store.ts` - Zustand 认证状态管理
- `src/lib/api.ts` - API 客户端集成
- `src/pages/auth/LoginPage.tsx` - 登录页面
- `src/pages/auth/RegisterPage.tsx` - 注册页面
- `src/components/auth/ProtectedRoute.tsx` - 受保护路由守卫
- `src/components/auth/GuestRoute.tsx` - 访客路由守卫

### 功能特性
1. **认证状态管理**
   - Zustand + persist 持久化
   - Token 自动存储到 localStorage
   - 登录/登出状态切换

2. **表单验证**
   - react-hook-form + zod
   - 邮箱格式验证
   - 密码长度验证 (≥8字符)
   - 确认密码匹配验证

3. **路由保护**
   - 未登录用户访问受保护页面 → 重定向到 /login
   - 已登录用户访问认证页面 → 重定向到 /

## TASK-011: 主要页面

### 文件清单
- `src/pages/dashboard/DashboardPage.tsx` - 签到主页
- `src/pages/settings/SettingsPage.tsx` - 设置页面
- `src/pages/dashboard/HistoryPage.tsx` - 历史记录
- `src/components/check-in/CheckInButton.tsx` - 签到按钮
- `src/components/check-in/StatusCard.tsx` - 状态卡片
- `src/components/history/HistoryItem.tsx` - 历史条目
- `src/components/ui/TimePicker.tsx` - 时间选择器

### 功能特性
1. **Dashboard 页面**
   - 动态问候语 (早上好/下午好/晚上好)
   - 大号签到按钮 (160x160px)
   - 三种状态: 待签到(绿色)、逾期(红色脉冲)、已签到(灰色)
   - 可选备注输入

2. **Settings 页面**
   - 截止时间选择器
   - 提醒时间选择器
   - 提醒开关
   - 登出功能

3. **History 页面**
   - 分页显示签到记录
   - 友好日期格式 (今天、昨天、1月15日)
   - 签到时间和备注显示

### UI 组件
- shadcn/ui: Button, Input, Label, Card
- Lucide icons: Home, History, Settings, Check, Loader2

## 构建验证
- `pnpm run build` 成功
- 无 TypeScript 错误
- 无 any 类型
