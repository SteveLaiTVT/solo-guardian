# iter-017: 离线优先移动端与友好错误提示

**日期**: 2026-01-19
**版本**: 3.13.0
**架构参考**: ADR-023

## 问题背景

用户在弱网络环境下使用移动App时遇到以下问题：
1. 网络不好时无法查看联系人和签到历史
2. 网络断开时无法签到
3. 错误信息显示技术术语，用户看不懂
4. 不知道当前是在线还是离线状态

## 解决方案

### 核心架构：本地优先 (Local-First)

```
数据读取流程:
  本地数据库 → 立即显示 → 后台同步服务器数据 → 更新UI

数据写入流程:
  写入本地 → 加入同步队列 → (在线时)同步到服务器
```

### 任务列表

| 任务ID | 标题 | 优先级 | 说明 |
|--------|------|--------|------|
| TASK-102 | 本地数据库 (Isar) | P0 | 添加本地持久化层 |
| TASK-103 | 离线优先仓库模式 | P0 | 实现 Local -> Remote 链式仓库 |
| TASK-104 | 待处理操作队列 | P0 | 离线时队列操作，在线时同步 |
| TASK-105 | 网络连接监控 | P0 | 监控网络状态，触发同步 |
| TASK-106 | 友好错误提示 | P1 | 用户友好的错误UI和离线指示器 |
| TASK-107 | Token刷新弹性 | P0 | 确保离线时Token刷新能正确重试 |
| TASK-108 | Web端友好错误 | P1 | Web端错误提示和网络状态指示器 |

## 实施阶段

### 阶段1：基础设施
- TASK-102: 本地数据库设置
- TASK-105: 网络连接监控

### 阶段2：同步机制
- TASK-104: 待处理操作队列
- TASK-103: 离线优先仓库模式

### 阶段3：弹性与用户体验
- TASK-107: Token刷新弹性处理
- TASK-106: 移动端友好错误
- TASK-108: Web端友好错误

## 技术选型

### 本地数据库
- **推荐**: Isar (高性能NoSQL)
- **备选**: Drift/sqflite (SQL)

### 网络监控
- connectivity_plus 包

### 数据模型
```dart
// 本地签到记录
class LocalCheckIn {
  Id? id;
  String? serverId;  // 服务器ID (未同步时为null)
  DateTime date;
  String? note;
  SyncStatus syncStatus;  // synced | pending | failed
}

// 待处理操作
class PendingOperation {
  Id? id;
  OperationType type;  // createCheckIn | updateSettings | ...
  String dataJson;
  int retryCount;
}
```

### 同步策略
- **冲突解决**: 以服务器时间戳为准
- **重试策略**: 指数退避 (1s, 2s, 4s, 8s, 16s)
- **最大重试**: 5次，之后标记失败允许手动重试

## 用户体验改进

### 错误提示 (中文)
- 无网络: "无网络连接。您的更改已保存在本地。"
- 超时: "连接超时，请重试。"
- 服务器错误: "出现问题，请稍后重试。"
- 会话过期: "会话已过期，请重新登录。"

### UI指示器
- 顶部离线横幅
- 应用栏同步状态图标
- 待同步操作数量徽章

## 文件变更

已创建：
- `.claude/DESIGN_STATE.yaml` - 添加iter-017和ADR-023
- `.claude/handoffs/iter-017/HO-102-108.yaml` - B Session任务交接

## 下一步

B Session应该：
1. 阅读 ADR-023 了解架构设计
2. 按阶段顺序实施任务
3. 创建功能分支：`git checkout -b feature/iter-017-offline-first`
4. 先实现TASK-102和TASK-105 (基础设施)
