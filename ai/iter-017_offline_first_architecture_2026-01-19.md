# 离线优先移动端架构实现 (iter-017)

## 任务概述
作为B会话实现者，完成了iter-017的离线优先移动端架构和错误用户体验改进。

## 完成的任务

### TASK-102: 添加本地数据库和数据模型
- 最初尝试使用 Isar 数据库，但遇到依赖冲突（isar_generator 需要 analyzer <6.0.0，而 retrofit_generator 需要 >=6.9.0）
- 解决方案：切换到 SQLite (sqflite)，不需要代码生成
- 创建的文件：
  - `core/database/database_service.dart` - SQLite 数据库初始化和模式创建
  - `core/database/models/sync_enums.dart` - 同步状态枚举（SyncStatus, OperationType, EntityType）
  - `core/database/models/local_models.dart` - 本地数据模型（LocalCheckIn, LocalContact, LocalSettings, PendingOperation）
  - `core/database/converters/model_converters.dart` - API 模型与本地模型的转换器

### TASK-103: 实现离线优先仓库模式
- 创建三个离线优先仓库：
  - `offline_first_check_in_repository.dart` - 签到离线优先仓库
  - `offline_first_contacts_repository.dart` - 联系人离线优先仓库
  - `offline_first_settings_repository.dart` - 设置离线优先仓库
- 模式：本地优先读取、乐观写入、同步队列

### TASK-104: 创建待处理操作同步队列
- `core/sync/sync_manager.dart` - 管理同步队列处理
- 指数退避重试逻辑：[1, 2, 4, 8, 16] 秒
- 最大重试次数：5次

### TASK-105: 添加网络连接监控
- `core/network/connectivity_service.dart` - 使用 connectivity_plus 的单例服务
- 跟踪在线/离线状态，提供连接变化回调

### TASK-106: 添加友好错误消息和离线提示UI
- `core/errors/offline_errors.dart` - OfflineException, SyncException 类
- `presentation/widgets/offline_indicator.dart` - UI 组件：
  - OfflineBanner - 离线状态横幅
  - SyncStatusIndicator - 同步状态指示器
  - PendingSyncBadge - 待同步徽章
  - OfflineAwareButton - 离线感知按钮

### TASK-107: 增强令牌刷新以应对离线场景
- `core/network/resilient_auth_interceptor.dart` - 增强的认证拦截器
- 支持离线队列，网络恢复后自动重试

### TASK-108: Web 端友好错误消息
- 更新 `apps/user-web/src/i18n/locales/{en,zh,ja}/error.json`
- 添加 network.offline, network.offlineHint, network.reconnected, network.reconnecting
- `hooks/useNetworkStatus.ts` - React hook 用于网络状态监控
- `components/ui/NetworkStatusIndicator.tsx` - React 组件用于离线横幅

### 集成
- `presentation/providers/offline_providers.dart` - Riverpod 提供者用于离线优先功能

## 依赖变更
```yaml
# pubspec.yaml 添加
sqflite: ^2.3.2
path_provider: ^2.1.2
path: ^1.9.0
connectivity_plus: ^6.1.4
```

## Git 提交
```
feat(mobile,web): implement offline-first architecture (iter-017)

Mobile (Flutter):
- Add SQLite database with local models for check-ins, contacts, settings
- Implement offline-first repository pattern with local-first reads
- Create pending operations sync queue with retry logic
- Add network connectivity monitoring service
- Add resilient auth interceptor with offline queue support
- Create offline UI widgets (OfflineBanner, SyncStatusIndicator)
- Add Riverpod providers for offline-first state management

Web (React):
- Add friendly network error messages (en/zh/ja)
- Create useNetworkStatus hook for connection monitoring
- Add NetworkStatusIndicator component for offline banner

TASK-102 through TASK-108
```

## 技术决策记录
1. **数据库选择**: 从 Isar 切换到 SQLite (sqflite)
   - 原因：避免代码生成器依赖冲突
   - 优点：更稳定的依赖关系，广泛使用

2. **同步策略**: 本地优先 + 乐观更新
   - 读取：先本地后远程
   - 写入：先本地保存，后台同步

3. **重试机制**: 指数退避
   - 延迟：1, 2, 4, 8, 16 秒
   - 最大重试：5次

## 文件统计
- 新增文件：26个
- 代码行数：3614行新增
