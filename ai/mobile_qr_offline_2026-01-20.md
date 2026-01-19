# 移动端QR码分享和离线支持

## 需求
1. 家庭成员分享邀请应显示QR码，下方有链接和复制按钮
2. 添加离线数据缓存，网络请求失败时显示缓存数据而非错误页面

## 实现内容

### 1. QR码邀请分享对话框

**新增依赖** (pubspec.yaml):
- `qr_flutter: ^4.1.0` - QR码生成
- `share_plus: ^10.1.4` - 系统分享功能

**新增文件**:
- [invitation_share_dialog.dart](apps/mobile/solo_guardian/lib/presentation/widgets/invitation_share_dialog.dart)

**功能**:
- 顶部显示QR码（可扫描接受邀请）
- 中间显示"或"分隔线
- 底部显示链接和复制按钮
- 支持系统分享功能
- 复制后显示成功提示

**更新文件**:
- [caregiver_screen.dart](apps/mobile/solo_guardian/lib/presentation/screens/caregiver/caregiver_screen.dart) - 使用新对话框

### 2. 离线数据缓存

**新增文件**:
- [check_in_cache_service.dart](apps/mobile/solo_guardian/lib/core/cache/check_in_cache_service.dart) - 签到数据缓存服务

**功能**:
- 自动缓存成功的API响应到本地SQLite数据库
- 缓存有效期1小时
- 网络错误时自动返回缓存数据
- 支持按用户ID管理缓存

**更新文件**:
- [check_in_repository_impl.dart](apps/mobile/solo_guardian/lib/data/repositories/check_in_repository_impl.dart) - 添加缓存逻辑
- [core_providers.dart](apps/mobile/solo_guardian/lib/presentation/providers/core_providers.dart) - 注入缓存服务
- [main.dart](apps/mobile/solo_guardian/lib/main.dart) - 初始化缓存表和连接服务

### 3. 离线状态提示

**新增文件**:
- [offline_banner.dart](apps/mobile/solo_guardian/lib/presentation/widgets/offline_banner.dart) - 离线状态横幅

**功能**:
- 监听网络连接状态
- 离线时在屏幕顶部显示橙色提示条
- 显示"正在使用缓存数据"提示
- 提供重试按钮

**更新文件**:
- [main_scaffold.dart](apps/mobile/solo_guardian/lib/presentation/widgets/main_scaffold.dart) - 集成离线横幅

### 4. 国际化

新增以下翻译键（英/中/日）:
- `caregiverScanQrCode` - 扫描QR码提示
- `caregiverShareMessage` - 分享消息模板
- `or` - "或"
- `copy` - 复制
- `share` - 分享
- `copiedToClipboard` - 已复制提示
- `offlineModeMessage` - 离线模式提示
- `offlineCheckInNotAvailable` - 离线签到不可用提示
- `usingCachedData` - 使用缓存数据提示

## 测试步骤

1. **QR码分享**:
   - 进入"关怀"页面 -> "我的看护人"标签
   - 点击"邀请看护人"按钮
   - 选择关系类型
   - 验证显示QR码、链接和复制/分享按钮

2. **离线缓存**:
   - 正常登录并查看签到状态
   - 关闭网络（飞行模式）
   - 重新打开App或刷新页面
   - 验证显示缓存数据而非错误页面
   - 验证顶部显示离线提示条

## 注意事项
- 缓存有效期为1小时，过期后仍需要网络连接
- 签到操作仍需要网络连接（不支持离线签到）
- QR码包含完整的邀请链接，扫描后可直接接受邀请
