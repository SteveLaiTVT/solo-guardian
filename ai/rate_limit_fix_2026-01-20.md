# 限流错误处理修复

## 问题
移动应用启动时显示原始的DioException错误信息，用户体验很差：
- 错误信息显示 "DioException [bad response]: This exception was thrown because the response has a status code of 429"
- 应该显示友好的"请求过于频繁"提示

## 修复内容

### 1. 后端限流配置优化 (apps/backend/src/app.module.ts)
- 默认限制从 100 请求/分钟 提升到 300 请求/分钟（适应移动端启动时的并发请求）
- 短时限制从 5 请求/分钟 提升到 10 请求/分钟
- 长时限制从 3 请求/10分钟 提升到 5 请求/10分钟

### 2. 添加重试拦截器 (apps/mobile/solo_guardian/lib/core/network/retry_interceptor.dart)
- 新增 RetryInterceptor 处理 429 和 503 错误
- 支持最多 3 次重试
- 指数退避延迟策略
- 支持 Retry-After 响应头

### 3. 错误处理工具优化 (apps/mobile/solo_guardian/lib/core/utils/error_utils.dart)
- 新增 `_parseRawErrorMessage` 方法解析原始错误字符串
- 新增 `extractError` 静态方法提取错误信息和i18n键
- 支持 DioException 状态码识别（429、503、500、401等）
- 自动将技术错误转换为用户友好的本地化消息

### 4. Provider 错误处理统一
更新以下 Provider 使用 `ErrorUtils.extractError`:
- check_in_provider.dart
- settings_provider.dart
- preferences_provider.dart
- contacts_provider.dart
- caregiver_provider.dart

## 错误映射
| 错误类型 | 用户提示 |
|---------|---------|
| HTTP 429 | 请求过于频繁，请稍后重试 |
| HTTP 503 | 服务暂时不可用 |
| HTTP 500/502 | 系统内部错误 |
| HTTP 401 | 未授权访问 |
| 网络连接错误 | 网络连接失败 |
| 超时 | 网络连接失败 |

## 测试
1. 重启后端服务应用新的限流配置
2. 重新编译移动应用
3. 启动应用验证错误显示是否友好
