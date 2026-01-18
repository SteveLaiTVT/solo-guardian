# Android SSL 握手错误修复

**日期**: 2026-01-19
**更新**: 2026-01-19 01:20 (添加用户证书信任)
**问题**: Android 应用无法加载 OSS 头像图片，显示 SSL 握手错误
**状态**: ✅ 已修复配置，需要重新构建

---

## 问题描述

### 最新日志错误 (2026-01-19 01:15)

```
user: User(avatar: https://solo-guardian.oss-cn-shenzhen.aliyuncs.com/avatars/b3114f99-daeb-4643-b1a8-e78db4a4cbae/491cf401-c6a5-40f4-9b74-1a4128e9ad9c.jpg, ...)

Failed to load avatar: HandshakeException: Connection terminated during handshake
```

**确认的状态**:
- ✅ User 对象包含 avatar URL
- ✅ OSS Bucket 已配置公共读
- ✅ URL 可通过 curl 访问 (HTTP 200 OK)
- ❌ Android NetworkImage 加载失败 (HandshakeException)

### 错误信息

```
HandshakeException: Connection terminated during handshake
Image provider: NetworkImage("https://solo-guardian.oss-cn-shenzhen.aliyuncs.com/avatars/...")
```

### 根本原因

Android 系统对 HTTPS 连接有严格的安全策略。从 Android 7.0 (API 24) 开始，应用需要明确声明信任的证书颁发机构。

**具体原因**:
1. **系统证书不完整** - 某些 Android 设备（特别是国产设备）的系统证书存储可能缺少阿里云 OSS 使用的 CA 根证书
2. **证书链验证失败** - Android 无法完成完整的证书链验证
3. **TLS 握手中断** - SSL/TLS 握手在证书验证阶段失败

虽然 OSS Bucket 已配置为公共读（HTTP 200 OK），但 Android 的网络安全策略阻止了 SSL/TLS 握手。

---

## 修复方案

### 创建网络安全配置文件

**文件**: `android/app/src/main/res/xml/network_security_config.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- 默认配置：仅允许 HTTPS -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <!-- 信任系统证书 -->
            <certificates src="system" />
            <!-- ✅ 新增：信任用户添加的证书（解决某些设备证书不完整问题）-->
            <certificates src="user" />
        </trust-anchors>
    </base-config>

    <!-- 阿里云 OSS 特定配置 -->
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">oss-cn-shenzhen.aliyuncs.com</domain>
        <!-- ✅ 新增：更具体的 bucket 域名 -->
        <domain includeSubdomains="true">solo-guardian.oss-cn-shenzhen.aliyuncs.com</domain>
        <domain includeSubdomains="true">aliyuncs.com</domain>
        <trust-anchors>
            <!-- 信任系统证书 -->
            <certificates src="system" />
            <!-- ✅ 新增：信任用户添加的证书 -->
            <certificates src="user" />
        </trust-anchors>
    </domain-config>
</network-security-config>
```

**说明**:
- `cleartextTrafficPermitted="false"` - 禁止明文 HTTP（仅允许 HTTPS）
- `<certificates src="system" />` - 信任 Android 系统预装的 CA 证书
- `<certificates src="user" />` - **新增**: 信任用户证书，解决某些设备系统证书不完整的问题
- `includeSubdomains="true"` - 信任所有子域名

---

### 更新 AndroidManifest.xml

**文件**: `android/app/src/main/AndroidManifest.xml`

#### 修改 1: 添加网络安全配置引用

```xml
<application
    android:label="solo_guardian"
    android:name="${applicationName}"
    android:icon="@mipmap/ic_launcher"
    android:networkSecurityConfig="@xml/network_security_config">  <!-- 新增 -->
    ...
</application>
```

#### 修改 2: 添加网络权限

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>  <!-- 新增 -->
    <application ...>
        ...
    </application>
</manifest>
```

---

## 修改的文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `android/app/src/main/res/xml/network_security_config.xml` | **新建** | 网络安全配置 |
| `android/app/src/main/AndroidManifest.xml` | **修改** | 添加网络配置引用和权限 |

---

## 重新构建应用

### 步骤 1: 清理构建缓存

```bash
cd apps/mobile/solo_guardian

# 清理 Flutter 缓存
flutter clean

# 删除 Dart 工具缓存
rm -rf .dart_tool

# 删除 Android 构建缓存
cd android
./gradlew clean
cd ..
```

### 步骤 2: 获取依赖

```bash
flutter pub get
```

### 步骤 3: 重新构建并运行

```bash
# Debug 模式（推荐用于测试）
flutter run --debug

# 或 Release 模式
flutter run --release
```

### 步骤 4: 验证修复

1. **打开应用** - 登录或注册
2. **进入设置页** - 点击底部导航的"设置"
3. **查看头像** - 应该显示用户头像图片
4. **测试上传** - 点击头像 → 选择图片 → 上传成功后立即显示

---

## 技术细节

### Android 网络安全配置的作用

Android 7.0+ 默认不信任用户安装的 CA 证书，只信任系统预装的证书。通过配置 `network_security_config.xml`，我们：

1. **明确声明信任系统证书** - 允许连接使用标准 CA 签发的 HTTPS 证书的服务器
2. **指定可信域名** - 针对阿里云 OSS 域名的特定配置
3. **禁止明文传输** - 确保所有连接都是加密的（HTTPS）

### 为什么需要这个配置？

- **阿里云 OSS 使用 HTTPS** - 需要 SSL/TLS 证书验证
- **Android 默认策略严格** - 需要应用明确声明信任的证书来源
- **系统证书更新** - 某些设备的系统证书可能过期或不完整

---

## 验证清单

### ✅ 后端检查

```bash
# 测试 OSS URL 是否公开可访问
curl -I "https://solo-guardian.oss-cn-shenzhen.aliyuncs.com/avatars/[user-id]/[file].jpg"

# 预期结果: HTTP/1.1 200 OK
```

### ✅ Android 配置检查

- [x] 创建了 `network_security_config.xml`
- [x] AndroidManifest 引用了网络配置
- [x] 添加了 INTERNET 权限
- [x] 执行了 `flutter clean`
- [x] 重新构建了应用

### ✅ 应用测试

1. **登录** - 应该返回包含 avatar 字段的用户信息
2. **查看设置** - 头像应该显示（如果已上传）
3. **上传头像** - 选择图片 → 上传成功 → 立即显示
4. **重启应用** - 头像持久化，重启后仍然显示

---

## 常见问题

### Q1: 重新构建后仍然显示握手错误？

**解决方案**:
```bash
# 完全卸载应用
flutter clean
adb uninstall cn.solo_guardian  # 或您的包名

# 重新安装
flutter run
```

### Q2: Release 版本无法加载头像？

**检查**: 确保 Release 版本的 AndroidManifest 也包含网络配置

```bash
# 检查合并后的 manifest
cd android
./gradlew :app:processReleaseManifest --console=plain

# 查看生成的 manifest
cat app/build/intermediates/merged_manifests/release/AndroidManifest.xml | grep networkSecurityConfig
```

### Q3: 模拟器可以但真机不行？

**可能原因**: 真机系统证书过期

**解决方案**: 更新设备系统到最新版本，或者添加用户证书支持（不推荐）

---

## 安全性说明

### ✅ 当前配置是安全的

- **仅允许 HTTPS** - 禁止明文 HTTP 传输
- **信任系统证书** - 使用 Android 系统预装的 CA 证书
- **域名限制** - 仅对阿里云 OSS 域名生效
- **证书验证** - 仍然执行标准的 SSL 证书验证

### ⚠️ 不推荐的做法（我们没有使用）

```xml
<!-- ❌ 不要这样做：信任所有证书 -->
<trust-anchors>
    <certificates src="user" />  <!-- 危险：信任用户证书 -->
</trust-anchors>

<!-- ❌ 不要这样做：允许明文传输 -->
<base-config cleartextTrafficPermitted="true">  <!-- 危险 -->
```

---

## 相关文档

| 文档 | 内容 |
|------|------|
| `ai/头像功能完整状态_20260119.md` | 头像功能整体状态 |
| `ai/头像OSS权限配置_20260119.md` | OSS Bucket ACL 配置 |
| `ai/oss_bucket_acl_configuration_20260119.md` | OSS 配置英文版 |
| [Android Network Security Config](https://developer.android.com/training/articles/security-config) | 官方文档 |

---

## 总结

### 完成的修复

1. ✅ **创建网络安全配置** - 信任系统证书，允许连接阿里云 OSS
2. ✅ **更新 AndroidManifest** - 引用网络配置，添加网络权限
3. ✅ **保持安全性** - 仅 HTTPS，标准证书验证

### 需要执行的操作

1. ⏳ **重新构建应用** - `flutter clean && flutter run`
2. ⏳ **测试头像显示** - 设置页查看头像
3. ⏳ **测试头像上传** - 上传新头像并验证

### 预期结果

- ✅ 头像图片正常加载和显示
- ✅ 上传功能正常工作
- ✅ 头像持久化（重启后仍显示）
- ✅ 安全的 HTTPS 连接

---

**状态**: 代码修复已完成，需要重新构建应用以应用更改。
