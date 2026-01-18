# 设置界面闪屏问题修复

## 问题描述
在设置属性的时候尽量不要重新渲染，闪屏什么的。这样的体验很差就像开启提醒，每日截止时间，提醒时间，高对比度,切换主题什么的，字体大小，减少动画都会闪屏。

## 修改内容

### 1. 实现乐观更新 (Optimistic Updates)

#### `apps/mobile/solo_guardian/lib/presentation/providers/settings_provider.dart`
- 修改 `updateSettings()` 方法，在调用 API 之前立即更新 UI
- 移除了 `isLoading: true` 状态，避免加载状态导致的重新渲染
- 保留了错误处理，但保持乐观更新的 UI 状态

```dart
Future<void> updateSettings({...}) async {
  // 乐观更新 - 立即更新 UI，不设置 loading 状态
  if (state.settings != null) {
    final currentSettings = state.settings!;
    final optimisticSettings = CheckInSettings(
      deadlineTime: deadlineTime ?? currentSettings.deadlineTime,
      reminderTime: reminderTime ?? currentSettings.reminderTime,
      reminderEnabled: reminderEnabled ?? currentSettings.reminderEnabled,
      // ... 其他字段
    );
    state = SettingsState(settings: optimisticSettings);  // ✅ 无 isLoading
  }

  try {
    final settings = await settingsRepo.updateSettings(...);
    state = SettingsState(settings: settings);
  } catch (e) {
    state = state.copyWith(error: errorMsg);  // 保持乐观更新
    rethrow;
  }
}
```

#### `apps/mobile/solo_guardian/lib/presentation/providers/preferences_provider.dart`
- 同样实现了乐观更新机制
- 在 `updatePreferences()` 中立即更新主题、字体大小、高对比度、减少动画等设置
- 先解析主题类型，然后立即更新 UI

### 2. 创建细粒度监听组件

#### 新建文件 `apps/mobile/solo_guardian/lib/presentation/widgets/settings_widgets.dart`
创建了 7 个独立的 ConsumerWidget，每个只监听自己需要的特定字段：

1. **DeadlineTimeSetting**
   - 只监听 `settings.deadlineTime`
   - 仅当截止时间变化时重建

2. **ReminderEnabledSetting**
   - 只监听 `settings.reminderEnabled`
   - 仅当提醒开关变化时重建

3. **ReminderTimeSetting**
   - 监听 `settings.reminderTime` 和 `settings.reminderEnabled`
   - 仅当提醒时间或开关变化时重建

4. **ThemeSetting**
   - 只监听 `preferences.theme`
   - 仅当主题变化时重建

5. **FontSizeSetting**
   - 只监听 `preferences.fontSize`
   - 仅当字体大小变化时重建

6. **HighContrastSetting**
   - 只监听 `preferences.highContrast`
   - 仅当高对比度变化时重建

7. **ReducedMotionSetting**
   - 只监听 `preferences.reducedMotion`
   - 仅当减少动画设置变化时重建

每个组件都使用 Riverpod 的 `select()` 方法实现精确监听：

```dart
final deadlineTime = ref.watch(
  settingsProvider.select((state) => state.settings?.deadlineTime),
);
```

### 3. 集成到设置界面

#### `apps/mobile/solo_guardian/lib/presentation/screens/settings/settings_screen.dart`

将细粒度组件集成到设置界面的各个部分：

**打卡设置部分 (_buildCheckInSettings)**
```dart
Widget _buildCheckInSettings(AppLocalizations l10n, ThemeData theme) {
  return Column(
    children: [
      DeadlineTimeSetting(showTimePickerDialog: _showTimePickerDialog),
      const ReminderEnabledSetting(),
      ReminderTimeSetting(showTimePickerDialog: _showTimePickerDialog),
    ],
  );
}
```

**外观设置部分 (_buildAppearanceSettings)**
```dart
Widget _buildAppearanceSettings(AppLocalizations l10n, ThemeData theme) {
  return const Column(
    children: [
      ThemeSetting(),
      FontSizeSetting(),
      HighContrastSetting(),
      ReducedMotionSetting(),
    ],
  );
}
```

## 技术实现原理

### 双重优化策略

1. **乐观更新 (Optimistic Updates)**
   - 在 API 调用完成前立即更新 UI
   - 避免了 `isLoading` 状态导致的整个状态对象变化
   - 用户操作后立即看到结果，无等待时间

2. **精确字段监听 (Granular Watching)**
   - 使用 Riverpod 的 `select()` 方法
   - 每个组件只监听自己关心的特定字段
   - 当其他字段变化时，该组件不会重建

### 效果

现在改变任何设置都不会导致：
- ❌ 整个页面重新渲染
- ❌ 屏幕闪烁
- ❌ 其他无关组件重建

而是：
- ✅ 只有相关的特定组件重建
- ✅ UI 立即响应用户操作
- ✅ 流畅的用户体验

## 附加修复：字体大小响应问题

### 问题
用户在设置中更改字体大小时，界面文字没有任何变化。

### 原因
设置界面所有文字都使用了硬编码的 `fontSize`，例如：
- `const TextStyle(fontSize: 18)`
- `const TextStyle(fontSize: 16)`

这些常量不会随着主题的 `fontSize` 设置变化。

### 解决方案
将所有硬编码的字体大小替换为主题的 `textTheme` 样式：

```dart
// 之前 - 硬编码
Text(l10n.settingsDeadline, style: const TextStyle(fontSize: 18))

// 之后 - 使用主题
Text(l10n.settingsDeadline, style: theme.textTheme.titleMedium)
```

### 映射关系
- `fontSize: 20` → `theme.textTheme.titleLarge`
- `fontSize: 18` → `theme.textTheme.titleMedium`
- `fontSize: 16` → `theme.textTheme.bodyLarge`
- `fontSize: 14` → `theme.textTheme.bodyMedium`
- `fontSize: 24` → `theme.textTheme.headlineMedium`

### 效果
现在当用户拖动字体大小滑块（14-24px）时，设置界面的所有文字都会立即随之缩放。

## 附加修复：高对比度模式 Switch 可见性

### 问题
在高对比度模式下，开关（Switch）控件几乎看不见。

### 原因
高对比度模式使用黑色背景和黄色主色，但 Switch 组件没有专门的配色方案。

### 解决方案
在 `app_theme.dart` 中添加 `switchTheme` 配置：

**高对比度模式下：**
- 激活状态：黑色拇指 + 黄色轨道 + 黄色边框
- 未激活状态：深灰色拇指 + 深灰色轨道 + 浅灰色边框

**普通模式下：**
- 保持 Flutter 默认样式

### 效果
在高对比度模式下，所有 Switch 开关都具有清晰的视觉对比度，易于识别和操作。

## 修改文件列表

1. `apps/mobile/solo_guardian/lib/presentation/providers/settings_provider.dart` - 修改（修复编译错误）
2. `apps/mobile/solo_guardian/lib/presentation/providers/preferences_provider.dart` - 修改
3. `apps/mobile/solo_guardian/lib/presentation/widgets/settings_widgets.dart` - 新建
4. `apps/mobile/solo_guardian/lib/presentation/screens/settings/settings_screen.dart` - 修改
5. `apps/mobile/solo_guardian/lib/presentation/widgets/profile_edit_dialog.dart` - 修改（字体响应）
6. `apps/mobile/solo_guardian/lib/theme/app_theme.dart` - 修改（Switch 可见性）

## 测试建议

运行应用后测试以下操作：

### 闪屏测试
确认以下操作没有闪屏现象：
1. 切换提醒开关
2. 修改每日截止时间
3. 修改提醒时间
4. 切换主题（标准/暖色/自然/海洋）
5. 拖动字体大小滑块
6. 切换高对比度开关
7. 切换减少动画开关

所有操作都应该流畅进行，不会看到页面闪烁或重新加载。

### 字体大小测试
1. 将字体大小滑块拖到最小（14）
2. 观察设置页面所有文字是否变小
3. 将字体大小滑块拖到最大（24）
4. 观察设置页面所有文字是否变大
5. 在不同字体大小下，确认所有文字都清晰可读

### 高对比度测试
1. 开启高对比度模式
2. 观察页面是否变为黑底黄字
3. 检查所有 Switch 开关是否清晰可见
4. 尝试切换各个开关，确认状态清晰可辨
5. 关闭高对比度模式，确认恢复正常
