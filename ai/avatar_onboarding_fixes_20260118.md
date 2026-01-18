# 头像上传和启动引导页问题修复

**问题来源**: 用户上传头像后设置页不显示，重启应用后再次显示引导页流程

## 问题1: 头像上传后不显示

### 根本原因
- 后端API返回格式: `{ success: true, data: {...} }`
- 移动端 `uploadAvatar` 方法错误地解析 `response.data` 而不是 `response.data['data']`
- 导致头像URL无法正确提取和保存到用户对象

### 修改文件
**apps/mobile/solo_guardian/lib/data/repositories/preferences_repository_impl.dart**
- 第86-87行: 修改响应解析逻辑
- 修改前: `return User.fromJson(response.data as Map<String, dynamic>);`
- 修改后:
  ```dart
  final responseData = response.data as Map<String, dynamic>;
  return User.fromJson(responseData['data'] as Map<String, dynamic>);
  ```

## 问题2: 重启应用后显示引导页

### 根本原因
路由重定向逻辑中，当偏好设置未加载时默认 `onboardingCompleted = false`，导致错误重定向到引导页。

具体流程:
1. 应用启动时 AuthProvider 初始化并检查认证状态
2. 路由重定向函数执行
3. 检查 `onboardingCompleted` 但此时偏好设置尚未加载
4. `prefsState.preferences` 为 null，默认为 false
5. 路由错误地重定向到引导页

### 修改文件

**apps/mobile/solo_guardian/lib/core/router/app_router.dart**
- 第61行: 添加 `prefsLoading` 变量检查偏好设置加载状态
- 第65行: 在调试日志中添加 `prefsLoading` 信息
- 第89-93行: 新增逻辑 - 如果用户已登录但偏好设置仍在加载，保持当前路由不变

修改内容:
```dart
// 添加偏好设置加载状态检查
final prefsLoading = prefsState.isLoading;

// 如果已登录但偏好设置仍在加载，保持当前路由
if (isLoggedIn && prefsLoading) {
  debugPrint('Router redirect: preferences loading, staying on current route');
  return null;
}
```

**apps/mobile/solo_guardian/lib/presentation/providers/auth_provider.dart**
- 第5行: 添加 `preferences_provider.dart` 导入
- 第63行: 在 `_checkAuth` 方法中，认证成功后自动加载偏好设置
- 第88行: 在 `login` 方法中，登录成功后自动加载偏好设置
- 第122行: 在 `register` 方法中，注册成功后自动加载偏好设置

修改内容:
```dart
// 认证成功后加载偏好设置
_ref.read(preferencesProvider.notifier).loadPreferences();
```

## 测试验证

### 问题1验证
1. 上传头像
2. 检查设置页中头像是否立即显示
3. 刷新页面，确认头像仍然显示

### 问题2验证
1. 完成引导流程
2. 关闭应用
3. 重新打开应用
4. 确认直接进入仪表板页面，不再显示引导页

## 影响范围

- 移动端头像上传功能
- 移动端路由导航逻辑
- 移动端偏好设置加载时机

## 后端配置修复

**apps/backend/.env**
- 修复阿里云OSS配置错误:
  - `ALIYUN_OSS_BUCKET`: "oss-cn-shenzhen.aliyuncs.com" → "solo-guardian"
  - `ALIYUN_OSS_ENDPOINT`: "solo-guardian.oss-cn-shenzhen.aliyuncs.com" → "https://oss-cn-shenzhen.aliyuncs.com"

**apps/backend/.env.example**
- 解决合并冲突
- 保留SMTP、Twilio和OAuth配置
- 添加完整的阿里云OSS配置示例

## 注意事项

1. 需要重启后端服务以应用新的OSS配置
2. 确保阿里云OSS凭证正确且有效
3. 移动端需要重新构建以包含代码修改
