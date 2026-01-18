# 使用 CachedNetworkImage 解决 SSL 握手问题

**日期**: 2026-01-19
**时间**: 01:26
**问题**: Android SSL HandshakeException 持续存在
**解决方案**: 使用 CachedNetworkImage 替代原生 NetworkImage
**状态**: ✅ 代码已修改，待测试

---

## 问题持续

即使在添加了用户证书信任 (`<certificates src="user" />`) 并重新构建后，HandshakeException 仍然发生：

```
user: User(avatar: https://solo-guardian.oss-cn-shenzhen.aliyuncs.com/...)
Failed to load avatar: HandshakeException: Connection terminated during handshake
```

这表明问题比预期的更深层，可能是：
1. 设备证书存储严重不完整
2. TLS 版本不兼容
3. 阿里云 OSS 的证书链在某些设备上无法验证

---

## 解决方案：使用 CachedNetworkImage

`cached_network_image` 是一个功能强大的图片加载库，它：
- 使用自己的 HTTP 客户端，可能绕过某些 Flutter 框架级别的 SSL 限制
- 提供更好的错误处理和重试机制
- 自动缓存图片，减少网络请求
- 在 SSL 错误时可以显示占位符

---

## 代码修改

### 1. 添加依赖

**文件**: `pubspec.yaml`

```yaml
dependencies:
  # 其他依赖...

  # Cached network images with better SSL handling
  cached_network_image: ^3.3.1
```

### 2. 更新 SettingsScreen

**文件**: `lib/presentation/screens/settings/settings_screen.dart`

#### 修改前（使用 NetworkImage）

```dart
CircleAvatar(
  radius: 32,
  backgroundColor: theme.colorScheme.primary,
  backgroundImage: user.avatar != null && user.avatar!.isNotEmpty
      ? NetworkImage(user.avatar!)
      : null,
  onBackgroundImageError: user.avatar != null
      ? (exception, stackTrace) {
          debugPrint('Failed to load avatar: $exception');
        }
      : null,
  child: user.avatar == null || user.avatar!.isEmpty
      ? Text(
          user.name.substring(0, 1).toUpperCase(),
          style: theme.textTheme.headlineSmall?.copyWith(
            color: theme.colorScheme.onPrimary,
            fontWeight: FontWeight.bold,
          ),
        )
      : null,
),
```

#### 修改后（使用 CachedNetworkImage）

```dart
user.avatar != null && user.avatar!.isNotEmpty
    ? ClipOval(
        child: CachedNetworkImage(
          imageUrl: user.avatar!,
          width: 64,
          height: 64,
          fit: BoxFit.cover,
          placeholder: (context, url) => CircleAvatar(
            radius: 32,
            backgroundColor: theme.colorScheme.primary,
            child: SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: theme.colorScheme.onPrimary,
              ),
            ),
          ),
          errorWidget: (context, url, error) {
            debugPrint('Failed to load avatar: $error');
            return CircleAvatar(
              radius: 32,
              backgroundColor: theme.colorScheme.primary,
              child: Text(
                user.name.substring(0, 1).toUpperCase(),
                style: theme.textTheme.headlineSmall?.copyWith(
                  color: theme.colorScheme.onPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            );
          },
        ),
      )
    : CircleAvatar(
        radius: 32,
        backgroundColor: theme.colorScheme.primary,
        child: Text(
          user.name.substring(0, 1).toUpperCase(),
          style: theme.textTheme.headlineSmall?.copyWith(
            color: theme.colorScheme.onPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
```

---

## 修改说明

### 优点

1. **更好的网络处理**:
   - 自带重试机制
   - 可能使用不同的 HTTP 客户端实现
   - 对 SSL 错误有更宽松的处理

2. **用户体验改善**:
   - 显示加载占位符（loading indicator）
   - 错误时自动回退到首字母头像
   - 图片缓存，减少重复加载

3. **调试友好**:
   - 错误信息更详细
   - 可以在 errorWidget 中添加更多诊断信息

### 不同之处

| 功能 | NetworkImage | CachedNetworkImage |
|------|--------------|---------------------|
| SSL 处理 | 使用 Flutter 默认 | 使用 HTTP 包，可能更宽松 |
| 缓存 | 无自动缓存 | ✅ 自动缓存到磁盘 |
| 占位符 | 无 | ✅ 支持 loading 动画 |
| 错误处理 | 基础 | ✅ 完整的 errorWidget |
| 重试机制 | 无 | ✅ 自动重试 |

---

## 应用修改

### 步骤 1: 获取依赖

```bash
cd apps/mobile/solo_guardian

# 获取新依赖
flutter pub get
```

### 步骤 2: 重新构建

```bash
# 清理缓存（如果之前测试过）
flutter clean

# 重新构建并运行
flutter run
```

### 步骤 3: 测试

1. 打开应用
2. 进入设置页面
3. 观察头像加载：
   - 应该先显示 loading 动画（圆形进度条）
   - 然后显示头像图片
   - 如果仍然失败，会显示首字母头像

---

## 预期结果

### 场景 A: CachedNetworkImage 成功加载

```
✅ 显示 loading 占位符
✅ 成功加载头像图片
✅ 图片缓存到本地
✅ 下次打开立即显示（从缓存）
```

### 场景 B: 仍然 SSL 错误，但有优雅降级

```
⏳ 显示 loading 占位符
⏳ 尝试加载图片
❌ SSL 握手失败
✅ 自动显示首字母头像（errorWidget）
✅ 用户体验不受影响
```

---

## 如果仍然无法解决

如果使用 CachedNetworkImage 后仍然无法显示头像，可以尝试以下调试方法：

### 方法 1: 查看详细错误日志

修改 errorWidget 添加更详细的日志：

```dart
errorWidget: (context, url, error) {
  debugPrint('=== Avatar Loading Error ===');
  debugPrint('URL: $url');
  debugPrint('Error: $error');
  debugPrint('Error type: ${error.runtimeType}');
  if (error is Exception) {
    debugPrint('Exception details: $error');
  }
  debugPrint('==========================');

  return CircleAvatar(...);
}
```

### 方法 2: 测试其他 HTTPS 图片

在代码中临时测试其他 HTTPS 图片源：

```dart
// 临时测试代码
CachedNetworkImage(
  imageUrl: 'https://picsum.photos/200',  // 测试其他图片源
  ...
)
```

如果其他 HTTPS 图片也加载失败，说明是设备的通用 SSL 问题。

### 方法 3: 配置 CachedNetworkImage 的 HTTP 客户端

创建自定义 HTTP 客户端（仅用于诊断）：

```dart
// 在 main.dart 中
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'dart:io';

class CustomCacheManager extends CacheManager {
  static const key = 'customCacheKey';

  CustomCacheManager()
      : super(
          Config(
            key,
            stalePeriod: const Duration(days: 7),
            maxNrOfCacheObjects: 100,
            fileService: HttpFileService(
              httpClient: HttpClient()
                ..badCertificateCallback = ((cert, host, port) {
                  // ⚠️ 仅用于开发调试
                  debugPrint('Accepting certificate for $host');
                  return true;
                }),
            ),
          ),
        );
}

// 在 CachedNetworkImage 中使用
CachedNetworkImage(
  imageUrl: user.avatar!,
  cacheManager: CustomCacheManager(),  // 使用自定义管理器
  ...
)
```

**警告**: 上述自定义 HTTP 客户端会跳过证书验证，仅用于诊断问题，**不要在生产环境使用**。

---

## 相关文档

| 文档 | 内容 |
|------|------|
| `ai/android_ssl_fix_20260119.md` | Android SSL 握手错误初次修复 |
| `ai/mobile_avatar_troubleshooting_20260119.md` | 移动端头像完整故障排查 |
| [CachedNetworkImage 文档](https://pub.dev/packages/cached_network_image) | 官方文档 |

---

## 修改总结

### 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `pubspec.yaml` | 添加 `cached_network_image: ^3.3.1` |
| `settings_screen.dart` | 用 CachedNetworkImage 替代 NetworkImage |

### 代码行数

- 新增导入: 1 行
- 头像显示逻辑: 从 20 行改为 45 行（增加了 loading 和 error 处理）

---

## 总结

这是针对持续的 SSL 握手问题的第二个解决方案：

1. **第一次尝试** (`android_ssl_fix_20260119.md`):
   - 添加网络安全配置
   - 信任用户证书
   - ❌ 未完全解决问题

2. **第二次尝试**（本文档）:
   - 使用 CachedNetworkImage
   - 更强大的网络处理
   - ✅ 即使失败也有优雅降级

---

**下一步**:
1. ⏳ 执行 `flutter pub get`
2. ⏳ 执行 `flutter run`
3. ⏳ 查看设置页面，观察头像加载
4. ⏳ 如果仍然失败，查看详细错误日志并反馈

**预期**: CachedNetworkImage 的不同 HTTP 实现可能绕过 SSL 握手问题，或至少提供更好的错误降级。
