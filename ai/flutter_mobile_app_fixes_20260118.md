# Flutter 移动应用修复 - Solo Guardian

## 修复日期: 2026-01-18

## 修复内容概述

根据用户反馈修复了以下问题：
1. API 请求/响应类型不匹配
2. 引导页面设计与Web应用差异大
3. 认证页面和引导页面缺少语言切换

---

## 1. API 请求/响应类型修复

### 问题描述
所有 datasource 文件中的解析方法都期望 API 返回 `{"data": {...}}` 包装格式，但实际 API 直接返回数据。

### 修复文件
- `lib/data/datasources/auth_datasource.dart` - 已在之前修复
- `lib/data/datasources/check_in_datasource.dart`
- `lib/data/datasources/settings_datasource.dart`
- `lib/data/datasources/contacts_datasource.dart`
- `lib/data/datasources/preferences_datasource.dart`
- `lib/data/datasources/caregiver_datasource.dart`
- `lib/data/datasources/verification_datasource.dart`

### 修改内容
```dart
// 修复前 (错误)
final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
return Model.fromJson(data);

// 修复后 (正确)
final map = response as Map<String, dynamic>;
return Model.fromJson(map);

// 列表响应修复前 (错误)
final data = (response as Map<String, dynamic>)['data'] as List<dynamic>;

// 列表响应修复后 (正确)
final list = response as List<dynamic>;
return list.map((e) => Model.fromJson(e as Map<String, dynamic>)).toList();
```

---

## 2. 引导页面设计修复

### 问题描述
Flutter 引导页面与 Web 应用设计差异较大，文本交互不佳。

### 修复文件
- `lib/presentation/screens/onboarding/onboarding_screen.dart` - 完全重写

### 主要改进

#### 2.1 进度指示器
- **修改前**: 使用 LinearProgressIndicator
- **修改后**: 使用 9 个圆角药丸形状指示器，匹配 Web 设计

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.center,
  children: List.generate(_totalPages, (index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 3),
      width: 24,
      height: 8,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(4),
        color: index <= _currentPage
            ? theme.colorScheme.primary
            : theme.colorScheme.surfaceContainerHighest,
      ),
    );
  }),
),
```

#### 2.2 步骤内容重构

| 步骤 | 修改前 | 修改后 |
|------|--------|--------|
| 1. Welcome | 简单图标+标题 | 圆形背景图标+精美标题+副标题 |
| 2. Profile | TextFormField | DropdownButtonFormField 选择年份 |
| 3. Theme | 简单网格 | 带颜色圆圈的卡片，选中动画效果 |
| 4. Preferences | 高对比度/减少动画开关 | 新增"自动启用功能"vs"保持简单"选择卡片 |
| 5. Features | 功能列表 | 可切换的功能卡片（爱好签到、家庭访问） |
| 6. Visual | 基础设置 | 字体大小滑块+高对比度/减少动画/暖色调开关 |
| 7-9. Tutorials | 简单图标+描述 | 带图标的信息卡片列表，匹配 Web 设计 |

#### 2.3 导航按钮改进
- 添加"返回"按钮支持
- 添加"跳过"按钮（Profile/Theme 步骤）
- 统一按钮样式和位置

---

## 3. 语言切换功能

### 新增文件
- `lib/presentation/widgets/language_switcher.dart`

### 修改文件
- `lib/presentation/screens/auth/login_screen.dart`
- `lib/presentation/screens/auth/register_screen.dart`
- `lib/presentation/screens/onboarding/onboarding_screen.dart`

### 实现方式
```dart
class LanguageSwitcher extends ConsumerWidget {
  // 使用 PopupMenuButton 显示语言选择
  // 支持三种语言：
  // - English (en) 🇺🇸
  // - 中文 (zh) 🇨🇳
  // - 日本語 (ja) 🇯🇵
}
```

### 页面布局
在 Login、Register、Onboarding 页面右上角添加语言切换器：
```dart
Stack(
  children: [
    const Positioned(
      top: 16,
      right: 16,
      child: LanguageSwitcher(),
    ),
    // ... 页面内容
  ],
)
```

---

## 4. 本地化更新

### 修改文件
- `lib/l10n/arb/app_en.arb`

### 新增本地化键
```json
{
  "onboardingBack": "Back",
  "onboardingSkip": "Skip",
  "onboardingBirthYearHint": "This helps us customize content for your age group",
  "onboardingThemeStandard": "Standard",
  "onboardingThemeWarm": "Warm",
  "onboardingThemeNature": "Nature",
  "onboardingThemeOcean": "Ocean",
  "onboardingPreferenceTitle": "New Features",
  "onboardingPreferenceSubtitle": "...",
  "onboardingPreferenceEnableAll": "Enable automatically",
  "onboardingPreferenceEnableAllDesc": "...",
  "onboardingPreferenceKeepSimple": "Keep it simple",
  "onboardingPreferenceKeepSimpleDesc": "...",
  "onboardingFeaturesSubtitle": "Choose which optional features you'd like to enable",
  "onboardingFeatureHobby": "Hobby Check-in",
  "onboardingFeatureHobbyDesc": "Share what made you happy today",
  "onboardingFeatureFamily": "Family Access",
  "onboardingFeatureFamilyDesc": "Let family members check your status",
  "onboardingVisualSubtitle": "...",
  "onboardingWarmColors": "Warm Colors",
  "onboardingCheckInSubtitle": "...",
  "onboardingCheckInHowTo": "How to Check In",
  "onboardingCheckInHowToDesc": "...",
  "onboardingCheckInDeadline": "Check-in Deadline",
  "onboardingCheckInDeadlineDesc": "...",
  "onboardingCheckInReminder": "Get Reminders",
  "onboardingCheckInReminderDesc": "...",
  "onboardingContactsSubtitle": "...",
  "onboardingContactsAdd": "Add Contacts",
  "onboardingContactsAddDesc": "...",
  "onboardingContactsVerify": "Verify Contacts",
  "onboardingContactsVerifyDesc": "...",
  "onboardingContactsAlert": "Alert Notifications",
  "onboardingContactsAlertDesc": "...",
  "onboardingContactsPrivacy": "Your Privacy",
  "onboardingContactsPrivacyDesc": "...",
  "onboardingCaregiverSubtitle": "...",
  "onboardingCaregiverInvite": "Invite Family",
  "onboardingCaregiverInviteDesc": "...",
  "onboardingCaregiverQr": "Quick QR Invite",
  "onboardingCaregiverQrDesc": "...",
  "onboardingCaregiverMonitor": "Status Monitoring",
  "onboardingCaregiverMonitorDesc": "...",
  "onboardingCaregiverCheckIn": "Caregiver Check-in",
  "onboardingCaregiverCheckInDesc": "..."
}
```

**注意**: zh 和 ja 语言文件需要翻译这些新键。

---

## 5. 主题修复

### 修改文件
- `lib/theme/app_theme.dart`

### 修改内容
为 `_ThemeColors` 类添加 `secondary` 和 `accent` getter：
```dart
class _ThemeColors {
  // ... existing fields

  Color get secondary => muted;
  Color get accent => HSLColor.fromAHSL(1.0, primaryHsl.$1, primaryHsl.$2 * 0.8, primaryHsl.$3 * 1.2).toColor();
}
```

---

## 验证

运行 `flutter analyze` 结果：
- 错误: 0
- 警告: 7 (生成文件中的未使用参数)
- 信息: 4 (BuildContext 异步使用、废弃属性、私有类型)

所有严重问题已修复。

---

## 6. 年份选择器改进

### 问题描述
用户反馈年份选择器不够友好，应该支持点击直接输入。

### 修复内容
- **点击输入**: 点击年份显示区域弹出对话框，支持键盘输入年份
- **滚轮联动**: 输入后滚轮自动跳转到对应年份
- **使用 `FixedExtentScrollController`**: 支持程序化控制滚轮位置

```dart
// 点击弹出输入对话框
GestureDetector(
  onTap: () => _showYearInputDialog(l10n),
  child: Container(
    // 显示年份 + 编辑图标
  ),
)

// 输入后滚轮跳转
_yearScrollController.animateToItem(
  targetIndex,
  duration: Duration(milliseconds: _reducedMotion ? 50 : 300),
  curve: Curves.easeInOut,
);
```

---

## 7. 实时视觉设置预览

### 问题描述
用户反馈选择主题、字体大小、暖色调等设置时没有立即生效。

### 修复内容
- **整页主题包装**: 使用 `Theme` widget 包装 `Scaffold` 实现实时主题切换
- **暖色调调整**: 选择暖色调时整个页面背景变暖
- **动画尊重设置**: 所有动画根据 `_reducedMotion` 设置调整时长

```dart
@override
Widget build(BuildContext context) {
  final previewTheme = _previewTheme;
  final effectiveTheme = previewTheme.themeData;

  return Theme(
    data: effectiveTheme,
    child: Scaffold(
      backgroundColor: _warmColors
          ? _adjustWarmColor(effectiveTheme.scaffoldBackgroundColor)
          : effectiveTheme.scaffoldBackgroundColor,
      // ...
    ),
  );
}

// 暖色调调整方法
Color _adjustWarmColor(Color color) {
  final hsl = HSLColor.fromColor(color);
  return hsl.withHue((hsl.hue + 15) % 360)
      .withSaturation((hsl.saturation * 1.2).clamp(0.0, 1.0))
      .toColor();
}
```

---

## 验证

运行 `flutter analyze` 结果：
- 错误: 0
- 警告: 7 (生成文件中的未使用参数)
- 信息: 3 (BuildContext 异步使用、私有类型)

所有严重问题已修复。

---

## 8. 完成所有国际化翻译

### 问题描述
zh 和 ja 语言文件缺少引导页面的大部分翻译。

### 修复文件
- `lib/l10n/arb/app_zh.arb` - 添加 50 个新的翻译键
- `lib/l10n/arb/app_ja.arb` - 添加 50 个新的翻译键

### 新增翻译键
以下键已添加到 zh 和 ja 文件：

**引导页面导航:**
- `onboardingBack` - 返回 / 戻る
- `onboardingSkip` - 跳过 / スキップ
- `onboardingFinish` - 完成 / 完了
- `onboardingSaving` - 保存中... / 保存中...

**年份选择:**
- `onboardingBirthYearHint` - 年份提示说明
- `onboardingBirthYearTap` - 点击输入年份
- `onboardingBirthYearEnter` - 输入年份对话框标题
- `onboardingBirthYearInvalid` - 无效年份提示

**主题选择:**
- `onboardingThemeStandard` - 标准 / スタンダード
- `onboardingThemeWarm` - 温暖 / ウォーム
- `onboardingThemeNature` - 自然 / ナチュラル
- `onboardingThemeOcean` - 海洋 / オーシャン

**新功能设置:**
- `onboardingPreferenceTitle/Subtitle` - 标题/副标题
- `onboardingPreferenceEnableAll/Desc` - 自动启用选项
- `onboardingPreferenceKeepSimple/Desc` - 保持简洁选项

**功能选择:**
- `onboardingFeaturesSubtitle` - 副标题
- `onboardingFeatureHobby/Desc` - 兴趣打卡
- `onboardingFeatureFamily/Desc` - 家人访问

**视觉设置:**
- `onboardingVisualSubtitle` - 副标题
- `onboardingWarmColors` - 暖色调

**签到教程:**
- `onboardingCheckInSubtitle` - 副标题
- `onboardingCheckInHowTo/Desc` - 如何打卡
- `onboardingCheckInDeadline/Desc` - 截止时间
- `onboardingCheckInReminder/Desc` - 提醒功能

**联系人教程:**
- `onboardingContactsSubtitle` - 副标题
- `onboardingContactsAdd/Desc` - 添加联系人
- `onboardingContactsVerify/Desc` - 验证联系人
- `onboardingContactsAlert/Desc` - 警报通知
- `onboardingContactsPrivacy/Desc` - 隐私说明

**护理者教程:**
- `onboardingCaregiverSubtitle` - 副标题
- `onboardingCaregiverInvite/Desc` - 邀请家人
- `onboardingCaregiverQr/Desc` - 二维码邀请
- `onboardingCaregiverMonitor/Desc` - 状态监控
- `onboardingCaregiverCheckIn/Desc` - 代为打卡

---

## 验证

运行 `flutter gen-l10n` 结果：
- 无未翻译消息
- 所有 50 个键已完成中日文翻译

运行 `flutter analyze` 结果：
- 错误: 0
- 警告: 7 (生成文件中的未使用参数)
- 信息: 3 (BuildContext 异步使用、私有类型)

所有问题已修复，国际化完成。

---

## 9. 主页面错误处理修复

### 问题描述
首页、设置页、历史页面在 API 调用失败时不显示任何内容，导致页面空白。

### 修复文件
- `lib/presentation/screens/dashboard/dashboard_screen.dart`
- `lib/presentation/screens/settings/settings_screen.dart`
- `lib/presentation/screens/history/history_screen.dart`

### 修复内容

#### 9.1 添加错误状态显示
所有页面现在在 API 错误时显示：
- 错误图标
- 错误标题
- 错误详情
- 重试按钮

```dart
Widget _buildErrorState(String error, AppLocalizations l10n, ThemeData theme) {
  return Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.error_outline, size: 64, color: theme.colorScheme.error),
        const SizedBox(height: 16),
        Text(l10n.error, style: theme.textTheme.titleLarge?.copyWith(
          color: theme.colorScheme.error,
        )),
        const SizedBox(height: 8),
        Text(error, style: theme.textTheme.bodyMedium),
        const SizedBox(height: 24),
        FilledButton.icon(
          onPressed: () => ref.read(provider.notifier).loadData(),
          icon: const Icon(Icons.refresh),
          label: Text(l10n.retry),
        ),
      ],
    ),
  );
}
```

#### 9.2 修复 Auth Interceptor
Token 刷新响应解析修复：

```dart
// 修复前 (错误)
final tokens = data['data']?['tokens'] as Map<String, dynamic>?;

// 修复后 (正确)
final tokens = data['tokens'] as Map<String, dynamic>?;
```

---

## 10. GlobalKey 冲突修复

### 问题描述
用户在标签页之间切换时报错：`Multiple widgets used the same GlobalKey`，导致应用崩溃。

### 问题原因
在 `app_router.dart` 的 `redirect` 回调中使用 `ref.watch()` 会导致 router provider 被重建，进而重建所有 route widgets，但 GlobalKey 被复用导致冲突。

### 修复文件
- `lib/core/router/app_router.dart`

### 修复内容

#### 10.1 创建 RouterRefreshNotifier
```dart
class _RouterRefreshNotifier extends ChangeNotifier {
  _RouterRefreshNotifier(Ref ref) {
    ref.listen(authProvider, (_, __) => notifyListeners());
    ref.listen(preferencesProvider, (_, __) => notifyListeners());
  }
}
```

#### 10.2 使用 ref.read 替代 ref.watch
```dart
// 修复前 (错误)
redirect: (context, state) {
  final authState = ref.watch(authProvider);  // 导致 provider 重建
  final prefsState = ref.watch(preferencesProvider);
  // ...
}

// 修复后 (正确)
final appRouterProvider = Provider<GoRouter>((ref) {
  final refreshNotifier = _RouterRefreshNotifier(ref);

  return GoRouter(
    refreshListenable: refreshNotifier,  // 监听变化
    redirect: (context, state) {
      final authState = ref.read(authProvider);  // 只读取不订阅
      final prefsState = ref.read(preferencesProvider);
      // ...
    },
  );
});
```

### 原理说明
- `ref.watch()` 会导致 provider 在依赖变化时重建
- `ref.read()` 只读取当前值，不建立订阅关系
- `refreshListenable` 用于通知 GoRouter 需要重新评估 redirect 逻辑
- `_RouterRefreshNotifier` 使用 `ref.listen()` 监听 auth/prefs 变化并触发 `notifyListeners()`

---

## 11. 友好错误消息和仪表盘修复

### 问题描述
1. 错误消息显示原始异常信息，不友好
2. 仪表盘签到按钮和状态卡片显示异常（倒计时为空时标题为空）

### 修复文件
- `lib/core/utils/error_utils.dart` - 新增
- `lib/core/network/error_interceptor.dart` - 新增
- `lib/core/network/api_client.dart` - 添加 ErrorInterceptor
- `lib/presentation/providers/check_in_provider.dart` - 添加 errorI18nKey
- `lib/presentation/providers/settings_provider.dart` - 添加 errorI18nKey
- `lib/presentation/providers/preferences_provider.dart` - 添加 errorI18nKey
- `lib/presentation/screens/dashboard/dashboard_screen.dart` - 使用 ErrorUtils
- `lib/presentation/screens/history/history_screen.dart` - 使用 ErrorUtils
- `lib/presentation/screens/settings/settings_screen.dart` - 使用 ErrorUtils
- `lib/l10n/arb/app_en.arb` - 添加错误消息翻译
- `lib/l10n/arb/app_zh.arb` - 添加错误消息翻译
- `lib/l10n/arb/app_ja.arb` - 添加错误消息翻译

### 修复内容

#### 11.1 错误消息映射 (ErrorUtils)
```dart
class ErrorUtils {
  static String getLocalizedMessage(
    AppLocalizations l10n,
    String? i18nKey,
    String? fallbackMessage,
  ) {
    return switch (i18nKey) {
      'error.auth.invalidCredentials' => l10n.errorAuthInvalidCredentials,
      'error.checkin.alreadyToday' => l10n.errorCheckinAlreadyToday,
      'error.network.failed' => l10n.errorNetworkFailed,
      // ... 更多映射
      _ => fallbackMessage ?? l10n.errorUnknown,
    };
  }
}
```

#### 11.2 Provider 状态扩展
所有 Provider 状态类添加 `errorI18nKey` 字段：
```dart
class TodayStatusState {
  final String? error;
  final String? errorI18nKey;  // 新增

  // _extractError 方法提取 i18nKey
  (String, String?) _extractError(dynamic e) {
    if (e is AppException) {
      return (e.message, e.i18nKey);
    }
    if (e is DioException && e.error is AppException) {
      final appEx = e.error as AppException;
      return (appEx.message, appEx.i18nKey);
    }
    return (e.toString(), null);
  }
}
```

#### 11.3 仪表盘状态卡片修复
```dart
// 修复前：倒计时为空时标题为空
title = _countdownText;

// 修复后：显示友好的状态文本
if (isOverdue) {
  title = l10n.statusOverdue;  // "签到已逾期"
} else {
  title = _countdownText.isNotEmpty
      ? l10n.statusTimeRemaining(_countdownText)  // "剩余 XX:XX:XX"
      : l10n.statusPending;  // "待签到"
}
```

#### 11.4 新增本地化键
```json
// 错误消息
"errorAuthInvalidCredentials": "邮箱或密码不正确，请重试。",
"errorCheckinAlreadyToday": "您今天已经签到了，做得好！",
"errorNetworkFailed": "无法连接网络，请检查您的网络连接。",
// ... 共 23 个错误消息键

// 状态显示
"statusPending": "待签到",
"statusOverdue": "签到已逾期",
"statusTimeRemaining": "剩余 {time}"
```

---

## 12. 仪表盘UI重新设计

### 问题描述
1. 错误消息没有友好的交互
2. 签到按钮和状态卡片不够清晰
3. 用户缺少使用提示

### 修复文件
- `lib/presentation/screens/dashboard/dashboard_screen.dart` - 完全重写
- `lib/l10n/arb/app_en.arb` - 添加新翻译键
- `lib/l10n/arb/app_zh.arb` - 添加新翻译键
- `lib/l10n/arb/app_ja.arb` - 添加新翻译键

### 修复内容

#### 12.1 状态卡片重新设计
- 更清晰的状态图标和颜色
- 主标题显示倒计时或状态
- 副标题提供更多上下文
- 时间信息以药丸标签显示

```dart
// 三种状态：
// 1. 已签到 (绿色): "今天已安全签到！" + "您的联系人已知道您是安全的"
// 2. 待签到 (橙色): "3:45:20" + "点击下方按钮进行签到"
// 3. 已逾期 (红色): "签到已逾期！" + "您的联系人可能很快会收到通知"
```

#### 12.2 签到按钮增强
- 脉冲动画吸引注意力 (尊重 reducedMotion 设置)
- 签到中状态显示进度指示器
- 逾期状态按钮变为红色
- 签到成功后弹出成功对话框

```dart
// 成功对话框
showDialog(
  context: context,
  builder: (context) => AlertDialog(
    icon: Icon(Icons.check_circle, size: 64, color: Colors.green),
    title: Text(l10n.checkInSuccessTitle),  // "签到成功！"
    content: Text(l10n.checkInSuccessMessage),  // "太棒了！..."
    actions: [
      FilledButton(
        onPressed: () => Navigator.pop(context),
        child: Text(l10n.ok),
      ),
    ],
  ),
);
```

#### 12.3 错误交互改进
- 错误卡片使用 Material 3 errorContainer 颜色
- 显示友好的错误标题和消息
- 提供重试按钮和连接检查提示
- 签到失败时显示浮动 SnackBar 带重试按钮

```dart
// 错误 SnackBar
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    content: Row(
      children: [
        Icon(Icons.error_outline, color: Colors.white),
        SizedBox(width: 12),
        Expanded(child: Text(message)),
      ],
    ),
    backgroundColor: Colors.red.shade700,
    behavior: SnackBarBehavior.floating,
    action: SnackBarAction(
      label: l10n.retry,
      textColor: Colors.white,
      onPressed: _handleCheckIn,
    ),
  ),
);
```

#### 12.4 用户提示卡片
根据不同状态显示不同提示：
- 待签到: "每日签到 - 在截止时间前签到，让您的联系人知道您是安全的"
- 已逾期: "别担心！- 您仍然可以现在签到..."
- 已签到: "今天已完成！- 明天再来进行下一次签到，保重！"

#### 12.5 新增翻译键 (12个)
```json
{
  "statusPendingSubtitle": "点击下方按钮进行签到",
  "statusOverdueTitle": "签到已逾期！",
  "statusOverdueSubtitle": "您的联系人可能很快会收到通知",
  "checkInNow": "立即签到！",
  "checkInSuccessTitle": "签到成功！",
  "checkInSuccessMessage": "太棒了！您的联系人已收到您安全的通知。",
  "checkInSuccessSubtitle": "您的联系人已知道您是安全的",
  "errorTipCheckConnection": "请检查您的网络连接后重试。",
  "tipPendingTitle": "每日签到",
  "tipPendingContent": "在截止时间前签到...",
  "tipOverdueTitle": "别担心！",
  "tipOverdueContent": "您仍然可以现在签到...",
  "tipCheckedInTitle": "今天已完成！",
  "tipCheckedInContent": "明天再来..."
}
```

---

## 验证

运行 `flutter analyze` 结果：
- 错误: 0
- 警告: 7 (生成文件中的未使用参数)
- 信息: 3 (BuildContext 异步使用、私有类型)

所有严重问题已修复。
