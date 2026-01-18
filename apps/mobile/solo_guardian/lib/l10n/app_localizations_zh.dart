// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Chinese (`zh`).
class AppLocalizationsZh extends AppLocalizations {
  AppLocalizationsZh([String locale = 'zh']) : super(locale);

  @override
  String get appName => '独居守护';

  @override
  String get loading => '加载中...';

  @override
  String get error => '发生错误';

  @override
  String get retry => '重试';

  @override
  String get cancel => '取消';

  @override
  String get save => '保存';

  @override
  String get saving => '保存中...';

  @override
  String get delete => '删除';

  @override
  String get ok => '确定';

  @override
  String get accept => '接受';

  @override
  String get navHome => '首页';

  @override
  String get navHistory => '历史';

  @override
  String get navCare => '关怀';

  @override
  String get navContacts => '联系人';

  @override
  String get navSettings => '设置';

  @override
  String get greetingMorning => '早上好！';

  @override
  String get greetingAfternoon => '下午好！';

  @override
  String get greetingEvening => '晚上好！';

  @override
  String get loginTitle => '欢迎回来';

  @override
  String get loginSubtitle => '登录您的账户以继续';

  @override
  String get loginButton => '登录';

  @override
  String get loginLoading => '登录中...';

  @override
  String get loginNoAccount => '还没有账户？';

  @override
  String get loginSignUp => '注册';

  @override
  String get loginFailed => '登录失败';

  @override
  String get registerTitle => '创建账户';

  @override
  String get registerSubtitle => '输入您的信息开始使用';

  @override
  String get registerButton => '创建账户';

  @override
  String get registerLoading => '创建中...';

  @override
  String get registerHasAccount => '已有账户？';

  @override
  String get registerSignIn => '登录';

  @override
  String get registerFailed => '注册失败';

  @override
  String get registerIdentifiersSection => '您希望如何登录？';

  @override
  String get registerIdentifiersHintOptional => '可选 - 您可以稍后添加';

  @override
  String get registerNoIdentifierTitle => '没有登录标识';

  @override
  String get registerNoIdentifierDescription => '您没有提供用户名、邮箱或手机号。确定要继续吗？';

  @override
  String get registerNoIdentifierCancel => '返回';

  @override
  String get registerNoIdentifierConfirm => '继续';

  @override
  String get fieldsEmail => '邮箱';

  @override
  String get fieldsEmailPlaceholder => 'you@example.com';

  @override
  String get fieldsPassword => '密码';

  @override
  String get fieldsPasswordPlaceholder => '••••••••';

  @override
  String get fieldsName => '姓名';

  @override
  String get fieldsNamePlaceholder => '您的姓名';

  @override
  String get fieldsConfirmPassword => '确认密码';

  @override
  String get fieldsIdentifier => '用户名、邮箱、手机号或ID';

  @override
  String get fieldsIdentifierPlaceholder => '输入用户名、邮箱、手机号或ID';

  @override
  String get fieldsUsername => '用户名';

  @override
  String get fieldsUsernamePlaceholder => '选择用户名';

  @override
  String get fieldsPhone => '手机号';

  @override
  String get fieldsPhonePlaceholder => '+86 1234567890';

  @override
  String get validationEmailInvalid => '请输入有效的邮箱';

  @override
  String get validationEmailRequired => '邮箱是必填项';

  @override
  String get validationPasswordRequired => '密码是必填项';

  @override
  String get validationPasswordMinLength => '密码至少需要8个字符';

  @override
  String get validationConfirmRequired => '请确认您的密码';

  @override
  String get validationPasswordMismatch => '密码不匹配';

  @override
  String get validationNameRequired => '姓名是必填项';

  @override
  String get statusSafe => '今天您很安全！';

  @override
  String statusCheckedInAt(String time) {
    return '已在 $time 签到';
  }

  @override
  String statusDeadline(String time) {
    return '截止时间：$time';
  }

  @override
  String get statusAlreadyCheckedIn => '已签到';

  @override
  String get statusTapToCheckIn => '点击按钮签到';

  @override
  String get buttonCheckIn => '签到';

  @override
  String get buttonCheckingIn => '签到中...';

  @override
  String get historyEmpty => '暂无签到记录';

  @override
  String get contactsEmpty => '暂无紧急联系人';

  @override
  String get contactsAdd => '添加联系人';

  @override
  String get contactsAddTitle => '添加紧急联系人';

  @override
  String get contactsLinked => '关联';

  @override
  String get contactsDeleteTitle => '删除联系人';

  @override
  String contactsDeleteConfirm(String name) {
    return '确定要删除 $name 吗？';
  }

  @override
  String get linkedContactsTitle => '关联联系人';

  @override
  String get linkedContactsEmpty => '暂无关联联系人';

  @override
  String get linkedContactsPending => '待处理邀请';

  @override
  String get linkedContactsActive => '已激活关联';

  @override
  String linkedContactsSince(String date) {
    return '自 $date 起';
  }

  @override
  String get settingsCheckIn => '签到设置';

  @override
  String get settingsCheckInDesc => '配置您的每日签到时间';

  @override
  String get settingsDeadline => '每日截止时间';

  @override
  String get settingsDeadlineDesc => '每天需要完成签到的时间';

  @override
  String get settingsReminder => '提醒';

  @override
  String get settingsReminderEnabled => '开启提醒';

  @override
  String get settingsReminderEnabledDesc => '在截止时间前收到提醒通知';

  @override
  String get settingsReminderTime => '提醒时间';

  @override
  String get settingsVisual => '显示设置';

  @override
  String get settingsVisualDesc => '自定义外观和无障碍选项';

  @override
  String get settingsTheme => '颜色主题';

  @override
  String get settingsFontSize => '字体大小';

  @override
  String get settingsHighContrast => '高对比度';

  @override
  String get settingsHighContrastDesc => '增强对比度以提高可读性';

  @override
  String get settingsReducedMotion => '减少动画';

  @override
  String get settingsReducedMotionDesc => '减少应用中的动画效果';

  @override
  String get settingsLanguage => '语言';

  @override
  String get settingsAvatarCamera => '拍照';

  @override
  String get settingsAvatarGallery => '从相册选择';

  @override
  String get settingsAvatarTapToChange => '点击头像更换';

  @override
  String get settingsAvatarSuccess => '头像更新成功';

  @override
  String get settingsAvatarError => '头像更新失败';

  @override
  String get settingsAccountTitle => '账户';

  @override
  String get settingsAccountDesc => '管理您的账户设置';

  @override
  String get settingsLogout => '退出登录';

  @override
  String get settingsLogoutTitle => '退出登录';

  @override
  String get settingsLogoutConfirm => '确定要退出登录吗？';

  @override
  String get settingsEditProfile => '编辑个人资料';

  @override
  String get settingsProfileUpdated => '个人资料已更新';

  @override
  String get settingsEditProfileTitle => '编辑个人资料';

  @override
  String get settingsBirthYear => '出生年份（选填）';

  @override
  String get settingsBirthYearHint => '例如：1960';

  @override
  String get settingsBirthYearInvalid => '出生年份格式不正确';

  @override
  String settingsBirthYearRange(String year) {
    return '出生年份应在 1900 到 $year 之间';
  }

  @override
  String get caregiverElders => '长辈';

  @override
  String get caregiverCaregivers => '我的看护人';

  @override
  String get caregiverEldersEmpty => '暂无需要照顾的长辈';

  @override
  String get caregiverCaregiversEmpty => '暂无添加的看护人';

  @override
  String get caregiverStatusCheckedIn => '今日已签到';

  @override
  String get caregiverStatusPending => '待签到';

  @override
  String get caregiverStatusOverdue => '已逾期';

  @override
  String get caregiverCheckIn => '代签到';

  @override
  String get caregiverCheckInTitle => '代为签到';

  @override
  String caregiverCheckInConfirm(String name) {
    return '确定为 $name 签到吗？';
  }

  @override
  String caregiverCheckInSuccess(String name) {
    return '已为 $name 签到';
  }

  @override
  String caregiverDeadline(String time) {
    return '截止时间：$time';
  }

  @override
  String caregiverPendingAlerts(int count) {
    return '$count 个待处理警报';
  }

  @override
  String get caregiverInvite => '邀请看护人';

  @override
  String get caregiverInviteTitle => '选择关系类型';

  @override
  String get caregiverTypeCaregiver => '看护人';

  @override
  String get caregiverTypeFamily => '家人';

  @override
  String get caregiverTypeCaretaker => '护理员';

  @override
  String get caregiverInvitationCreated => '邀请已创建';

  @override
  String get caregiverShareLink => '分享此链接：';

  @override
  String get onboardingNext => '下一步';

  @override
  String get onboardingBack => '返回';

  @override
  String get onboardingSkip => '跳过';

  @override
  String get onboardingComplete => '开始使用';

  @override
  String get onboardingWelcomeTitle => '欢迎使用独居守护';

  @override
  String get onboardingWelcomeSubtitle => '您的安全守护伙伴';

  @override
  String get onboardingProfileTitle => '关于您';

  @override
  String get onboardingProfileSubtitle => '帮助我们为您个性化体验';

  @override
  String get onboardingBirthYear => '出生年份';

  @override
  String get onboardingBirthYearHint => '这有助于我们为您定制适合年龄段的内容';

  @override
  String get onboardingBirthYearTap => '点击输入年份';

  @override
  String get onboardingBirthYearEnter => '输入年份';

  @override
  String get onboardingBirthYearInvalid => '请输入有效的年份';

  @override
  String get onboardingFinish => '完成';

  @override
  String get onboardingSaving => '保存中...';

  @override
  String get onboardingThemeTitle => '选择主题';

  @override
  String get onboardingThemeSubtitle => '选择一个让您感觉舒适的配色方案';

  @override
  String get onboardingThemeStandard => '标准';

  @override
  String get onboardingThemeWarm => '温暖';

  @override
  String get onboardingThemeNature => '自然';

  @override
  String get onboardingThemeOcean => '海洋';

  @override
  String get onboardingPreferenceTitle => '新功能设置';

  @override
  String get onboardingPreferenceSubtitle => '当我们推出新功能时，您希望如何处理？';

  @override
  String get onboardingPreferenceEnableAll => '自动启用';

  @override
  String get onboardingPreferenceEnableAllDesc => '新功能上线后立即可用';

  @override
  String get onboardingPreferenceKeepSimple => '保持简洁';

  @override
  String get onboardingPreferenceKeepSimpleDesc => '我会自己选择要启用的功能';

  @override
  String get onboardingFeaturesTitle => '个性化您的体验';

  @override
  String get onboardingFeaturesSubtitle => '选择您想要启用的可选功能';

  @override
  String get onboardingFeatureHobby => '兴趣打卡';

  @override
  String get onboardingFeatureHobbyDesc => '分享今天让您开心的事';

  @override
  String get onboardingFeatureFamily => '家人访问';

  @override
  String get onboardingFeatureFamilyDesc => '让家人可以查看您的状态';

  @override
  String get onboardingVisualTitle => '视觉舒适度';

  @override
  String get onboardingVisualSubtitle => '根据您的喜好调整显示设置';

  @override
  String get onboardingFontSize => '字体大小';

  @override
  String get onboardingFontSizePreview => '预览文本';

  @override
  String get onboardingHighContrast => '高对比度';

  @override
  String get onboardingReducedMotion => '减少动画';

  @override
  String get onboardingWarmColors => '暖色调';

  @override
  String get onboardingCheckInTitle => '每日打卡';

  @override
  String get onboardingCheckInSubtitle => '通过每日打卡让亲人知道您一切安好';

  @override
  String get onboardingCheckInHowTo => '如何打卡';

  @override
  String get onboardingCheckInHowToDesc => '只需每天点击首页的打卡按钮。您还可以添加关于近况的备注。';

  @override
  String get onboardingCheckInDeadline => '打卡截止时间';

  @override
  String get onboardingCheckInDeadlineDesc =>
      '在设置中设定每日截止时间。如果您未按时打卡，您的紧急联系人将收到通知。';

  @override
  String get onboardingCheckInReminder => '获取提醒';

  @override
  String get onboardingCheckInReminderDesc => '开启每日提醒帮助您记得打卡。您可以自定义提醒时间。';

  @override
  String get onboardingContactsTitle => '紧急联系人';

  @override
  String get onboardingContactsSubtitle => '添加在您错过打卡时会收到通知的联系人';

  @override
  String get onboardingContactsAdd => '添加联系人';

  @override
  String get onboardingContactsAddDesc => '添加最多5位紧急联系人，包括他们的邮箱和手机号码。';

  @override
  String get onboardingContactsVerify => '验证联系人';

  @override
  String get onboardingContactsVerifyDesc => '联系人需要验证邮箱才能收到通知。他们会收到确认链接。';

  @override
  String get onboardingContactsAlert => '警报通知';

  @override
  String get onboardingContactsAlertDesc => '如果您错过打卡截止时间，您的联系人将通过邮件或短信收到通知。';

  @override
  String get onboardingContactsPrivacy => '您的隐私';

  @override
  String get onboardingContactsPrivacyDesc => '联系人只能看到您是否打卡 - 无法看到您的备注或其他详情。';

  @override
  String get onboardingCaregiverTitle => '家人与护理者';

  @override
  String get onboardingCaregiverSubtitle => '让家人监控您的打卡状态';

  @override
  String get onboardingCaregiverInvite => '邀请家人';

  @override
  String get onboardingCaregiverInviteDesc => '邀请家人或护理者查看您的打卡状态，帮助关注您的健康状况。';

  @override
  String get onboardingCaregiverQr => '快速二维码邀请';

  @override
  String get onboardingCaregiverQrDesc => '分享二维码轻松邀请。他们只需扫码即可加入，无需输入任何内容。';

  @override
  String get onboardingCaregiverMonitor => '状态监控';

  @override
  String get onboardingCaregiverMonitorDesc => '受邀的家人可以查看您的每日打卡状态，并在需要时收到提醒。';

  @override
  String get onboardingCaregiverCheckIn => '代为打卡';

  @override
  String get onboardingCaregiverCheckInDesc => '护理者可以在您无法亲自打卡时代为打卡。';

  @override
  String get verifyContactSuccess => '邮箱已验证！';

  @override
  String get verifyContactFailed => '验证失败';

  @override
  String verifyContactMessage(String contactName, String userName) {
    return '$contactName 已被验证为 $userName 的紧急联系人';
  }

  @override
  String get acceptInvitationTitle => '看护人邀请';

  @override
  String acceptInvitationMessage(String name) {
    return '$name 邀请您成为他们的看护人';
  }

  @override
  String get acceptInvitationFailed => '加载邀请失败';

  @override
  String get acceptInvitationExpired => '此邀请已过期';

  @override
  String get acceptInvitationAlreadyAccepted => '此邀请已被接受';

  @override
  String get acceptContactLinkTitle => '紧急联系人关联';

  @override
  String acceptContactLinkMessage(String name) {
    return '$name 已将您添加为紧急联系人';
  }

  @override
  String get acceptContactLinkFailed => '加载邀请失败';

  @override
  String get errorTitleUser => '请检查您的输入';

  @override
  String get errorTitleSystem => '出了点问题';

  @override
  String get errorAuthInvalidCredentials => '邮箱或密码不正确，请重试。';

  @override
  String get errorAuthTokenExpired => '您的会话已过期，请重新登录。';

  @override
  String get errorAuthTokenInvalid => '您的会话无效，请重新登录。';

  @override
  String get errorAuthUnauthorized => '您没有权限访问此内容。';

  @override
  String get errorValidationFailed => '请检查您的输入后重试。';

  @override
  String get errorValidationEmailInvalid => '请输入有效的邮箱地址。';

  @override
  String get errorValidationRequiredField => '此字段为必填项。';

  @override
  String get errorUserNotFound => '用户不存在。';

  @override
  String get errorUserEmailExists => '此邮箱已注册，请尝试登录。';

  @override
  String get errorContactNotFound => '联系人不存在。';

  @override
  String get errorContactLimitReached => '您最多可以添加 5 位紧急联系人。请删除一位后再添加。';

  @override
  String get errorContactEmailExists => '此邮箱已在您的联系人列表中。';

  @override
  String get errorCheckinAlreadyToday => '您今天已经签到了，做得好！';

  @override
  String get errorCheckinSettingsNotFound => '请先设置您的签到选项。';

  @override
  String get errorPreferencesNotFound => '未找到偏好设置，让我们来设置一下吧！';

  @override
  String get errorPreferencesInvalidFeature => '无效的功能名称。';

  @override
  String get errorNetworkFailed => '无法连接网络，请检查您的网络连接。';

  @override
  String get errorSystemInternal => '抱歉，我们这边出了点问题。请稍后重试。';

  @override
  String get errorSystemUnavailable => '服务暂时不可用，请稍后重试。';

  @override
  String get errorSystemRateLimited => '请求太频繁，请稍等片刻后重试。';

  @override
  String get errorUnknown => '发生了意外错误，请重试。';

  @override
  String get statusPending => '待签到';

  @override
  String get statusPendingSubtitle => '点击下方按钮进行签到';

  @override
  String get statusOverdue => '已逾期';

  @override
  String get statusOverdueTitle => '签到已逾期！';

  @override
  String get statusOverdueSubtitle => '您的联系人可能很快会收到通知';

  @override
  String statusTimeRemaining(String time) {
    return '剩余 $time';
  }

  @override
  String get checkInNow => '立即签到！';

  @override
  String get checkInSuccessTitle => '签到成功！';

  @override
  String get checkInSuccessMessage => '太棒了！您的联系人已收到您安全的通知。';

  @override
  String get checkInSuccessSubtitle => '您的联系人已知道您是安全的';

  @override
  String get errorTipCheckConnection => '请检查您的网络连接后重试。';

  @override
  String get tipPendingTitle => '每日签到';

  @override
  String get tipPendingContent => '在截止时间前签到，让您的联系人知道您是安全的。';

  @override
  String get tipOverdueTitle => '别担心！';

  @override
  String get tipOverdueContent => '您仍然可以现在签到，您的联系人会收到您安全的通知。';

  @override
  String get tipCheckedInTitle => '今天已完成！';

  @override
  String get tipCheckedInContent => '明天再来进行下一次签到，保重！';
}
