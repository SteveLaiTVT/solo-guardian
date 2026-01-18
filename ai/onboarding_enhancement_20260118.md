# 新手引导增强 - 变更记录

## 需求概述

用户注册后应显示新手引导页面，包含：
1. 选择年龄（出生年份）
2. 填写一些信息（可跳过）
3. 选择主题

## 变更列表

### 数据库模式变更

- `apps/backend/prisma/schema.prisma`:
  - `User` 模型添加 `birthYear` 字段（可空整数）
  - `UserPreferences` 模型添加 `theme` 字段（默认 "standard"）

### 后端变更

#### 修改文件

- `apps/backend/src/modules/user-preferences/dto/update-preferences.dto.ts`:
  - 添加 `theme` 字段验证（枚举：standard, warm, nature, ocean）

- `apps/backend/src/modules/user-preferences/dto/preferences-response.dto.ts`:
  - 添加 `theme` 字段

- `apps/backend/src/modules/user-preferences/user-preferences.service.ts`:
  - 更新 `update` 方法支持 `theme` 字段
  - 添加 `getProfile` 方法
  - 添加 `updateProfile` 方法
  - 更新 `mapToResponse` 包含 `theme`

- `apps/backend/src/modules/user-preferences/user-preferences.repository.ts`:
  - 添加 `findUserById` 方法
  - 添加 `updateUser` 方法

- `apps/backend/src/modules/user-preferences/user-preferences.controller.ts`:
  - 添加 `GET /api/v1/preferences/profile` 端点
  - 添加 `PATCH /api/v1/preferences/profile` 端点

- `apps/backend/src/modules/auth/auth.repository.ts`:
  - `findById` 方法添加 `birthYear` 字段

#### 新增文件

- `apps/backend/src/modules/user-preferences/dto/update-profile.dto.ts`:
  - `UpdateProfileDto` - 更新用户资料请求 DTO
  - `ProfileResponseDto` - 用户资料响应 DTO

#### 测试文件更新

- `apps/backend/src/test/factories/user.factory.ts`: 添加 `birthYear` 字段
- `apps/backend/src/modules/user-preferences/user-preferences.service.spec.ts`: 添加 `theme` 字段
- `apps/backend/src/modules/user-preferences/user-preferences.controller.spec.ts`: 添加 `theme` 字段

### API 客户端变更

- `packages/api-client/src/types.ts`:
  - `User` 添加 `birthYear` 字段
  - `UserPreferences` 添加 `theme` 字段
  - `UpdatePreferencesRequest` 添加 `theme` 字段
  - 新增 `ThemeType` 类型
  - 新增 `UpdateProfileRequest` 接口

- `packages/api-client/src/api.ts`:
  - 添加 `preferences.getProfile` 方法
  - 添加 `preferences.updateProfile` 方法

- `packages/api-client/src/hooks.ts`:
  - 添加 `useProfile` hook
  - 添加 `useUpdateProfile` hook

### 前端变更

#### 修改文件

- `apps/user-web/src/pages/auth/RegisterPage.tsx`:
  - 注册成功后重定向到 `/onboarding`（原为 `/`）

- `apps/user-web/src/pages/onboarding/OnboardingPage.tsx`:
  - 步骤从 7 增加到 9 个
  - 新增 `profile` 和 `theme` 步骤
  - 集成 `useUpdateProfile` hook
  - 完成时保存用户资料和偏好设置

- `apps/user-web/src/components/onboarding/index.ts`:
  - 导出新组件

#### 新增文件

- `apps/user-web/src/components/onboarding/ProfileStep.tsx`:
  - 出生年份选择组件
  - 支持跳过功能

- `apps/user-web/src/components/onboarding/ThemeStep.tsx`:
  - 主题选择组件（4 种主题：标准、温暖、自然、海洋）
  - 支持跳过功能

### 国际化变更

#### 英文 (`i18n/locales/en/onboarding.json`)
```json
"profile": {
  "title": "About You",
  "subtitle": "Help us personalize your experience",
  "birthYear": "Year of Birth",
  "selectYear": "Select your birth year",
  "birthYearHint": "This helps us customize content for your age group"
},
"theme": {
  "title": "Choose Your Theme",
  "subtitle": "Select a color scheme that feels right for you",
  "options": {
    "standard": "Standard",
    "warm": "Warm",
    "nature": "Nature",
    "ocean": "Ocean"
  }
},
"common": {
  "skip": "Skip",
  "continue": "Continue"
}
```

#### 中文 (`i18n/locales/zh/onboarding.json`)
```json
"profile": {
  "title": "关于您",
  "subtitle": "帮助我们为您个性化体验",
  "birthYear": "出生年份",
  "selectYear": "选择您的出生年份",
  "birthYearHint": "这有助于我们为您定制适合年龄段的内容"
},
"theme": {
  "title": "选择主题",
  "subtitle": "选择一个让您感觉舒适的配色方案",
  "options": {
    "standard": "标准",
    "warm": "温暖",
    "nature": "自然",
    "ocean": "海洋"
  }
},
"common": {
  "skip": "跳过",
  "continue": "继续"
}
```

#### 日文 (`i18n/locales/ja/onboarding.json`)
```json
"profile": {
  "title": "あなたについて",
  "subtitle": "あなたに合った体験を提供するために",
  "birthYear": "生まれ年",
  "selectYear": "生まれ年を選択",
  "birthYearHint": "年齢層に合ったコンテンツを提供するために使用します"
},
"theme": {
  "title": "テーマを選択",
  "subtitle": "お好みの配色を選んでください",
  "options": {
    "standard": "スタンダード",
    "warm": "ウォーム",
    "nature": "ナチュラル",
    "ocean": "オーシャン"
  }
},
"common": {
  "skip": "スキップ",
  "continue": "続ける"
}
```

## 新手引导流程

1. **欢迎页** - 介绍应用
2. **个人资料** (新增) - 选择出生年份（可跳过）
3. **主题选择** (新增) - 选择颜色主题（可跳过）
4. **功能偏好** - 选择自动启用新功能或手动选择
5. **特性开关** - 启用兴趣打卡、家人访问等
6. **视觉设置** - 字体大小、高对比度等
7. **打卡教程** - 如何每日打卡
8. **联系人教程** - 如何添加紧急联系人
9. **护理者教程** - 如何邀请家人/护理者

## API 变更

### 新增端点

**GET /api/v1/preferences/profile**
- 获取用户资料信息

**PATCH /api/v1/preferences/profile**
- 更新用户资料（name, birthYear）

### 更新端点

**PATCH /api/v1/preferences**
- 新增 `theme` 字段

## 路由守卫逻辑修复

### 问题
用户注册/登录后没有自动跳转到 /onboarding 页面

### 解决方案

#### 新增文件
- `apps/user-web/src/components/auth/OnboardingGuard.tsx`:
  - 检查 `isOnboardingRequired` 状态
  - 如果未完成新手引导，重定向到 `/onboarding`
  - 显示加载状态直到偏好设置加载完成

#### 修改文件
- `apps/user-web/src/components/auth/index.ts`: 导出 `OnboardingGuard`
- `apps/user-web/src/App.tsx`:
  - 导入 `OnboardingGuard`
  - 将 `OnboardingGuard` 包裹在主应用路由外层
  - `/onboarding` 页面不受 OnboardingGuard 保护（允许直接访问）

### 路由结构
```
ProtectedRoute (认证检查)
├── /onboarding (新手引导页 - 无需完成引导即可访问)
└── OnboardingGuard (引导完成检查)
    └── Layout (主应用布局)
        ├── / (仪表板)
        ├── /history (历史记录)
        ├── /contacts (紧急联系人)
        ├── /contacts/linked (关联联系人)
        ├── /settings (设置)
        └── /caregiver (护理者)
```

### 流程
1. 用户注册 → 重定向到 `/onboarding`
2. 用户登录（未完成引导）→ OnboardingGuard 检测到 `onboardingCompleted=false` → 重定向到 `/onboarding`
3. 用户完成引导 → `onboardingCompleted=true` → 可访问主应用

## 语言切换和主题预览功能

### 需求
1. 登录页和注册页支持语言切换
2. 新手引导页支持语言切换
3. 主题选择时可以实时预览效果

### 修改文件

#### 前端页面
- `apps/user-web/src/pages/auth/LoginPage.tsx`:
  - 添加 `LanguageSwitcher` 组件到页面右上角

- `apps/user-web/src/pages/auth/RegisterPage.tsx`:
  - 添加 `LanguageSwitcher` 组件到页面右上角

- `apps/user-web/src/pages/onboarding/OnboardingPage.tsx`:
  - 添加 `LanguageSwitcher` 组件到页面右上角
  - 添加 `useEffect` 实现主题预览功能
  - 用户选择主题时，会立即应用主题 CSS 类以预览效果

#### CSS 主题
- `apps/user-web/src/index.css`:
  - 新增 `.theme-standard` 类（使用默认主题）
  - 新增 `.theme-warm` 类（橙色/琥珀色调）
  - 新增 `.theme-nature` 类（绿色/森林色调）
  - 新增 `.theme-ocean` 类（蓝色/青色调）

#### 主题上下文
- `apps/user-web/src/contexts/ThemeContext.tsx`:
  - 更新 `useEffect` 以应用保存的主题类
  - 主题类在用户偏好加载后自动应用

#### 组件更新
- `apps/user-web/src/components/onboarding/ThemeStep.tsx`:
  - 更新颜色预览样本以更准确地匹配实际主题颜色

### 主题颜色方案

| 主题 | 主色调 | 描述 |
|------|--------|------|
| Standard | 青绿色 (Teal) | 默认暖色调，代表关怀和安全 |
| Warm | 橙色 (Orange) | 温暖、友好的色调 |
| Nature | 绿色 (Green) | 自然、森林色调 |
| Ocean | 蓝色 (Sky Blue) | 海洋、清新色调 |

### 预览功能实现

1. 用户在 ThemeStep 中选择主题
2. `OnboardingPage` 的 `useEffect` 监听 `state.theme` 变化
3. 当主题变化时，移除所有主题类，添加新选择的主题类
4. CSS 变量立即更新，页面颜色实时改变
5. 组件卸载时清理主题类

## 验证清单

- [x] 后端编译成功
- [x] 前端编译成功
- [x] 路由守卫逻辑修复
- [x] 登录页语言切换
- [x] 注册页语言切换
- [x] 新手引导页语言切换
- [x] 主题实时预览
- [ ] 注册后自动跳转到新手引导
- [ ] 登录后（未完成引导）自动跳转到新手引导
- [ ] 出生年份选择功能正常
- [ ] 主题选择功能正常
- [ ] 跳过按钮正常工作
- [ ] 完成新手引导后设置保存正确
