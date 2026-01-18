# 移动端头像功能故障排查

**日期**: 2026-01-19
**问题**: 移动端看不到头像显示
**状态**: ✅ 问题已诊断 | 📋 待用户执行修复步骤

---

## 问题描述

用户在 Android 移动端设置页面看不到已上传的头像，显示的是默认头像（首字母圆圈）。

### 用户截图分析
- 显示位置: 设置页面顶部
- 当前显示: 绿色圆圈 + 首字母 "赖"
- 用户信息: 赖镇涛 (lai2396)
- 提示文字: "Tap avatar to change"

---

## 问题诊断

经过代码审查和文档分析，确认以下情况：

### ✅ 代码实现完整且正确

| 模块 | 文件 | 状态 |
|------|------|------|
| User 模型 | `apps/mobile/.../models/user.dart:13` | ✅ 包含 `avatar` 字段 |
| 头像显示 | `apps/mobile/.../screens/settings/settings_screen.dart:193-194` | ✅ 使用 `NetworkImage` 加载 |
| 头像上传 | `apps/mobile/.../screens/settings/settings_screen.dart:155` | ✅ 调用上传接口 |
| 头像持久化 | `apps/mobile/.../repositories/auth_repository_impl.dart:93-95` | ✅ 保存到本地存储 |
| 头像字段序列化 | `apps/mobile/.../repositories/auth_repository_impl.dart:105` | ✅ toJson 包含 avatar |

### ❌ 三个配置/环境问题

#### 问题 1: OSS Bucket ACL 未配置 (主要原因)

**现象**:
- 阿里云 OSS Bucket `solo-guardian` 未开启公共读权限
- 即使头像 URL 存在，移动端无法加载图片
- 浏览器访问头像 URL 返回 403 Forbidden

**影响**:
```
上传头像 → ✅ 成功
保存 URL → ✅ 成功
显示图片 → ❌ 失败 (NetworkImage 无法加载)
```

**解决方案**: 需要在阿里云控制台配置 Bucket ACL 为"公共读"

#### 问题 2: 用户需要重新登录

**原因**:
- 后端在 2026-01-18 修复了 auth API 返回 `avatar` 字段
- 如果用户在修复前登录，本地存储的 User 对象不包含 `avatar`
- 即使后端数据库有头像，本地存储的数据是旧的

**影响**:
```dart
// 本地存储的 User 对象 (修复前登录)
{
  "id": "xxx",
  "name": "赖镇涛",
  "avatar": null  // ❌ 缺少此字段或为 null
}
```

**解决方案**: 退出登录 → 重新登录，获取包含 `avatar` 的新 auth 响应

#### 问题 3: 移动端需要重新构建

**原因**:
- 近期修改了以下移动端代码:
  - `auth_provider.dart` - 添加头像持久化
  - `auth_repository_impl.dart` - 添加 updateStoredUser 方法
  - `app_router.dart` - 修复 onboarding 循环

**影响**:
- 运行中的 APK 不包含最新代码修复

**解决方案**: `flutter clean && flutter pub get && flutter run`

---

## 修复步骤

### 步骤 1: 配置 OSS Bucket ACL ⚙️ (5分钟手动操作)

1. 登录 [阿里云 OSS 控制台](https://oss.console.aliyun.com/)
2. 选择区域: **华南 1 (深圳)**
3. 点击 Bucket: **solo-guardian**
4. 左侧菜单: **访问控制** → **读写权限 (ACL)**
5. 修改 ACL 为 **公共读**:
   - 读权限: 公共
   - 写权限: 私有
6. 点击 **保存**

**验证配置成功**:
```bash
# 测试头像 URL 可公开访问
curl -I https://solo-guardian.oss-cn-shenzhen.aliyuncs.com/avatars/xxx/avatar.png

# 预期: HTTP/1.1 200 OK (而不是 403 Forbidden)
```

### 步骤 2: 重新构建移动端 🔨 (3分钟)

```bash
cd apps/mobile/solo_guardian

# 清理缓存
flutter clean
rm -rf .dart_tool

# 获取依赖
flutter pub get

# 重新运行
flutter run  # 或 flutter build apk
```

### 步骤 3: 退出并重新登录 🔄 (1分钟)

1. 打开 Solo Guardian 移动端
2. 进入 **设置页面**
3. 滚动到底部，点击 **退出登录**
4. 使用 `lai2396` 重新登录

**登录后验证**:
```
登录请求 → 后端返回包含 avatar 字段的 User 对象
↓
保存到本地 SecureStorage
↓
设置页面读取 User 对象
↓
如果 avatar 不为空 → 使用 NetworkImage 显示
```

### 步骤 4: 测试头像上传和显示 ✅

**测试流程**:
```
1. 进入设置页面
2. 点击头像区域 (提示 "Tap avatar to change")
3. 选择 "相机" 或 "相册"
4. 选择一张图片
5. 上传中显示 loading 动画
6. 上传成功后头像立即显示
7. 退出应用
8. 重新打开 → 头像依然显示 ✅
```

---

## 调试方法

如果完成以上步骤后头像仍未显示，使用以下方法调试:

### 方法 1: 查看 Flutter 调试日志

```bash
cd apps/mobile/solo_guardian
flutter run --debug

# 查找关键日志:
# - "AuthProvider: Got user: [name]" - 应包含 avatar 字段
# - "Failed to load avatar: [error]" - 表示图片加载失败
# - User 对象是否包含 avatar URL
```

### 方法 2: 测试后端 API

```bash
# 启动后端
cd apps/backend
pnpm run start:dev

# 运行 API 测试脚本
cd ../..
chmod +x test-api.sh
./test-api.sh

# 检查 Test 6 是否成功上传头像
# 检查返回的 avatar URL 是否可访问
```

### 方法 3: 手动测试 Profile API

```bash
# 登录获取 token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"lai2396","password":"your-password"}'

# 使用返回的 token 获取 profile
ACCESS_TOKEN="..."
curl http://localhost:3000/api/v1/preferences/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 检查返回的 JSON 是否包含 avatar 字段
```

---

## 相关文档

| 文档 | 说明 |
|------|------|
| `ai/头像功能完整状态_20260119.md` | 头像功能完整实现总结 |
| `ai/头像OSS权限配置_20260119.md` | OSS Bucket ACL 配置详细步骤 |
| `ai/comprehensive_avatar_fix_20260118.md` | 头像功能全面实现 (英文) |
| `ai/avatar_auth_response_fix_20260118.md` | Auth 响应包含 avatar 修复 |

---

## 技术总结

### 代码实现完整性

| 功能 | 后端 | Mobile | 状态 |
|------|------|--------|------|
| User 模型包含 avatar | ✅ | ✅ | 完成 |
| Login 返回 avatar | ✅ | ✅ | 完成 |
| Register 返回 avatar | ✅ | ✅ | 完成 |
| Profile API | ✅ | ✅ | 完成 |
| 上传头像 API | ✅ | ✅ | 完成 |
| 头像持久化 | - | ✅ | 完成 |
| 头像显示 | - | ✅ | 完成 |
| NetworkImage 错误处理 | - | ✅ | 完成 |

### 需要手动配置

| 配置项 | 状态 | 耗时 |
|--------|------|------|
| OSS Bucket ACL | ⏳ 待配置 | 5分钟 |
| 重新构建移动端 | ⏳ 待执行 | 3分钟 |
| 退出并重新登录 | ⏳ 待执行 | 1分钟 |

---

## 预期结果

完成以上所有步骤后，移动端头像功能将正常工作：

- ✅ 登录后立即显示头像（如果已上传）
- ✅ 上传头像后立即显示
- ✅ 退出应用并重新打开，头像依然显示
- ✅ Web 端和移动端头像同步
- ✅ 头像图片可公开访问（无需认证）

---

**本次会话内容**:
- ✅ 代码审查 - 确认移动端代码实现正确
- ✅ 问题诊断 - 识别三个配置/环境问题
- ✅ 解决方案 - 提供详细修复步骤和调试方法
- ✅ 文档输出 - 创建本文档供参考

**需要用户操作**:
1. 配置 OSS Bucket ACL（5分钟）
2. 重新构建移动端（3分钟）
3. 退出并重新登录（1分钟）

**代码修改**: 无需修改代码，所有代码已正确实现
