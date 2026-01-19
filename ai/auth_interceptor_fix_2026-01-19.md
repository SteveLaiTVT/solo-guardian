# 修复 Flutter 移动端 AuthInterceptor 异步竞争条件问题

## 问题描述

用户报告：移动端应用显示已认证状态 (`AuthStatus.authenticated`)，但 API 请求返回 401 错误（`AUTH_1003 tokenInvalid`）。

## 根本原因

`AuthInterceptor.onRequest()` 方法存在经典的 Dart 异步/void 反模式：

```dart
// 修复前 - 存在问题
@override
void onRequest(...) async {  // ← void + async = 竞争条件！
  final accessToken = await _storage.getAccessToken();  // ← 异步操作
  options.headers['Authorization'] = 'Bearer $accessToken';
  handler.next(options);  // ← 在 await 完成前可能已执行
}
```

当使用 `Interceptor` 时，Dio 调用 `onRequest()` 但不会等待其异步结果。Token 获取操作在请求已经发出之后才执行，导致 Authorization header 未被设置。

## 修复方案

**文件**: `apps/mobile/solo_guardian/lib/core/network/auth_interceptor.dart`

**变更**:
1. `class AuthInterceptor extends Interceptor` → `class AuthInterceptor extends QueuedInterceptor`
2. `void onRequest(...)` → `Future<void> onRequest(...)`
3. `void onError(...)` → `Future<void> onError(...)`

**原因**:
- `QueuedInterceptor` 会序列化请求处理，确保每个请求的拦截器逻辑完成后才处理下一个
- 正确声明 `Future<void>` 返回类型以匹配异步方法

## 影响范围

- 修复了所有需要认证的 API 调用（preferences、check-in、contacts 等）
- 无破坏性变更
- 向后兼容

## 测试建议

1. 重新构建 Flutter 应用
2. 登录后验证 `/api/v1/preferences` 调用成功
3. 验证所有认证接口正常工作
