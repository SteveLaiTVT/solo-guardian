// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Japanese (`ja`).
class AppLocalizationsJa extends AppLocalizations {
  AppLocalizationsJa([String locale = 'ja']) : super(locale);

  @override
  String get appName => 'ソロガーディアン';

  @override
  String get loading => '読み込み中...';

  @override
  String get error => 'エラーが発生しました';

  @override
  String get retry => '再試行';

  @override
  String get cancel => 'キャンセル';

  @override
  String get save => '保存';

  @override
  String get saving => '保存中...';

  @override
  String get delete => '削除';

  @override
  String get ok => 'OK';

  @override
  String get accept => '承認';

  @override
  String get navHome => 'ホーム';

  @override
  String get navHistory => '履歴';

  @override
  String get navCare => 'ケア';

  @override
  String get navContacts => '連絡先';

  @override
  String get navSettings => '設定';

  @override
  String get greetingMorning => 'おはようございます！';

  @override
  String get greetingAfternoon => 'こんにちは！';

  @override
  String get greetingEvening => 'こんばんは！';

  @override
  String get loginTitle => 'おかえりなさい';

  @override
  String get loginSubtitle => 'アカウントにログインしてください';

  @override
  String get loginButton => 'ログイン';

  @override
  String get loginLoading => 'ログイン中...';

  @override
  String get loginNoAccount => 'アカウントをお持ちでないですか？';

  @override
  String get loginSignUp => '新規登録';

  @override
  String get loginFailed => 'ログインに失敗しました';

  @override
  String get registerTitle => 'アカウント作成';

  @override
  String get registerSubtitle => '情報を入力して始めましょう';

  @override
  String get registerButton => 'アカウント作成';

  @override
  String get registerLoading => '作成中...';

  @override
  String get registerHasAccount => 'すでにアカウントをお持ちですか？';

  @override
  String get registerSignIn => 'ログイン';

  @override
  String get registerFailed => '登録に失敗しました';

  @override
  String get registerIdentifiersSection => 'ログイン方法を選択';

  @override
  String get registerIdentifiersHintOptional => 'オプション - 後で追加できます';

  @override
  String get registerNoIdentifierTitle => 'ログイン識別子がありません';

  @override
  String get registerNoIdentifierDescription =>
      'ユーザー名、メール、電話番号が入力されていません。続けますか？';

  @override
  String get registerNoIdentifierCancel => '戻る';

  @override
  String get registerNoIdentifierConfirm => '続ける';

  @override
  String get fieldsEmail => 'メール';

  @override
  String get fieldsEmailPlaceholder => 'you@example.com';

  @override
  String get fieldsPassword => 'パスワード';

  @override
  String get fieldsPasswordPlaceholder => '••••••••';

  @override
  String get fieldsName => '名前';

  @override
  String get fieldsNamePlaceholder => 'お名前';

  @override
  String get fieldsConfirmPassword => 'パスワード確認';

  @override
  String get fieldsIdentifier => 'ユーザー名、メール、電話番号、またはID';

  @override
  String get fieldsIdentifierPlaceholder => 'ユーザー名、メール、電話番号、またはIDを入力';

  @override
  String get fieldsUsername => 'ユーザー名';

  @override
  String get fieldsUsernamePlaceholder => 'ユーザー名を選択';

  @override
  String get fieldsPhone => '電話番号';

  @override
  String get fieldsPhonePlaceholder => '+81 90 1234 5678';

  @override
  String get validationEmailInvalid => '有効なメールアドレスを入力してください';

  @override
  String get validationEmailRequired => 'メールアドレスは必須です';

  @override
  String get validationPasswordRequired => 'パスワードは必須です';

  @override
  String get validationPasswordMinLength => 'パスワードは8文字以上必要です';

  @override
  String get validationConfirmRequired => 'パスワードを確認してください';

  @override
  String get validationPasswordMismatch => 'パスワードが一致しません';

  @override
  String get validationNameRequired => '名前は必須です';

  @override
  String get statusSafe => '今日は安全です！';

  @override
  String statusCheckedInAt(String time) {
    return '$time にチェックイン済み';
  }

  @override
  String statusDeadline(String time) {
    return '締め切り：$time';
  }

  @override
  String get statusAlreadyCheckedIn => 'チェックイン済み';

  @override
  String get statusTapToCheckIn => 'ボタンをタップしてチェックイン';

  @override
  String get buttonCheckIn => 'チェックイン';

  @override
  String get buttonCheckingIn => 'チェックイン中...';

  @override
  String get historyEmpty => 'チェックイン履歴がありません';

  @override
  String get contactsEmpty => '緊急連絡先がありません';

  @override
  String get contactsAdd => '連絡先を追加';

  @override
  String get contactsAddTitle => '緊急連絡先を追加';

  @override
  String get contactsLinked => 'リンク';

  @override
  String get contactsDeleteTitle => '連絡先を削除';

  @override
  String contactsDeleteConfirm(String name) {
    return '$name を削除してもよろしいですか？';
  }

  @override
  String get linkedContactsTitle => 'リンクされた連絡先';

  @override
  String get linkedContactsEmpty => 'リンクされた連絡先がありません';

  @override
  String get linkedContactsPending => '保留中の招待';

  @override
  String get linkedContactsActive => 'アクティブなリンク';

  @override
  String linkedContactsSince(String date) {
    return '$date から';
  }

  @override
  String get settingsCheckIn => 'チェックイン設定';

  @override
  String get settingsCheckInDesc => '毎日のチェックインスケジュールを設定';

  @override
  String get settingsDeadline => '毎日の締め切り';

  @override
  String get settingsDeadlineDesc => '毎日チェックインする必要がある時刻';

  @override
  String get settingsReminder => 'リマインダー';

  @override
  String get settingsReminderEnabled => 'リマインダーを有効化';

  @override
  String get settingsReminderEnabledDesc => '締め切り前に通知を受け取る';

  @override
  String get settingsReminderTime => 'リマインダー時刻';

  @override
  String get settingsVisual => '表示設定';

  @override
  String get settingsVisualDesc => '外観とアクセシビリティをカスタマイズ';

  @override
  String get settingsTheme => 'カラーテーマ';

  @override
  String get settingsFontSize => '文字サイズ';

  @override
  String get settingsHighContrast => '高コントラスト';

  @override
  String get settingsHighContrastDesc => '視認性を高めるためコントラストを上げる';

  @override
  String get settingsReducedMotion => 'モーション軽減';

  @override
  String get settingsReducedMotionDesc => 'アプリ全体のアニメーションを最小化';

  @override
  String get settingsLanguage => '言語';

  @override
  String get settingsAvatarCamera => '写真を撮る';

  @override
  String get settingsAvatarGallery => 'ギャラリーから選択';

  @override
  String get settingsAvatarTapToChange => 'タップしてアバターを変更';

  @override
  String get settingsAvatarSuccess => 'アバターが更新されました';

  @override
  String get settingsAvatarError => 'アバターの更新に失敗しました';

  @override
  String get settingsAccountTitle => 'アカウント';

  @override
  String get settingsAccountDesc => 'アカウント設定を管理';

  @override
  String get settingsLogout => 'ログアウト';

  @override
  String get settingsLogoutTitle => 'ログアウト';

  @override
  String get settingsLogoutConfirm => 'ログアウトしてもよろしいですか？';

  @override
  String get settingsEditProfile => 'プロフィールを編集';

  @override
  String get settingsProfileUpdated => 'プロフィールが更新されました';

  @override
  String get settingsEditProfileTitle => 'プロフィールを編集';

  @override
  String get settingsBirthYear => '生年（オプション）';

  @override
  String get settingsBirthYearHint => '例：1960';

  @override
  String get settingsBirthYearInvalid => '生年の形式が正しくありません';

  @override
  String settingsBirthYearRange(String year) {
    return '生年は1900から$yearの間である必要があります';
  }

  @override
  String get close => '閉じる';

  @override
  String get checkInNote => 'メモ';

  @override
  String get caregiverElders => 'お年寄り';

  @override
  String get caregiverCaregivers => '私の介護者';

  @override
  String get caregiverEldersEmpty => 'ケアする方がいません';

  @override
  String get caregiverCaregiversEmpty => '介護者が追加されていません';

  @override
  String get caregiverStatusCheckedIn => '今日チェックイン済み';

  @override
  String get caregiverStatusPending => 'チェックイン待ち';

  @override
  String get caregiverStatusOverdue => '期限切れ';

  @override
  String get caregiverCheckIn => '代理チェックイン';

  @override
  String get caregiverCheckInTitle => '代理チェックイン';

  @override
  String caregiverCheckInConfirm(String name) {
    return '$name の代わりにチェックインしますか？';
  }

  @override
  String caregiverCheckInSuccess(String name) {
    return '$name のチェックインが完了しました';
  }

  @override
  String caregiverDeadline(String time) {
    return '締め切り：$time';
  }

  @override
  String caregiverPendingAlerts(int count) {
    return '$count 件の保留中アラート';
  }

  @override
  String get caregiverInvite => '介護者を招待';

  @override
  String get caregiverInviteTitle => '関係タイプを選択';

  @override
  String get caregiverTypeCaregiver => '介護者';

  @override
  String get caregiverTypeFamily => '家族';

  @override
  String get caregiverTypeCaretaker => 'ケアテイカー';

  @override
  String get caregiverInvitationCreated => '招待が作成されました';

  @override
  String get caregiverShareLink => 'このリンクを共有：';

  @override
  String get caregiverScanQrCode => 'スマートフォンでこのQRコードをスキャンして招待を受け入れてください';

  @override
  String caregiverShareMessage(String url) {
    return 'Solo Guardianの介護者として招待されました。このリンクをクリックして受け入れてください：$url';
  }

  @override
  String get or => 'または';

  @override
  String get copy => 'コピー';

  @override
  String get share => '共有';

  @override
  String get copiedToClipboard => 'リンクがクリップボードにコピーされました';

  @override
  String get onboardingNext => '次へ';

  @override
  String get onboardingBack => '戻る';

  @override
  String get onboardingSkip => 'スキップ';

  @override
  String get onboardingComplete => '始める';

  @override
  String get onboardingWelcomeTitle => 'Solo Guardianへようこそ';

  @override
  String get onboardingWelcomeSubtitle => 'あなたの安心を守るパートナー';

  @override
  String get onboardingProfileTitle => 'あなたについて';

  @override
  String get onboardingProfileSubtitle => 'あなたに合った体験を提供するために';

  @override
  String get onboardingBirthYear => '生まれ年';

  @override
  String get onboardingBirthYearHint => '年齢層に合ったコンテンツを提供するために使用します';

  @override
  String get onboardingBirthYearTap => 'タップして年を入力';

  @override
  String get onboardingBirthYearEnter => '年を入力';

  @override
  String get onboardingBirthYearInvalid => '有効な年を入力してください';

  @override
  String get onboardingFinish => '完了';

  @override
  String get onboardingSaving => '保存中...';

  @override
  String get onboardingThemeTitle => 'テーマを選択';

  @override
  String get onboardingThemeSubtitle => 'お好みの配色を選んでください';

  @override
  String get onboardingThemeStandard => 'スタンダード';

  @override
  String get onboardingThemeWarm => 'ウォーム';

  @override
  String get onboardingThemeNature => 'ナチュラル';

  @override
  String get onboardingThemeOcean => 'オーシャン';

  @override
  String get onboardingPreferenceTitle => '新機能設定';

  @override
  String get onboardingPreferenceSubtitle => '新機能が追加されたとき、どのように対応しますか？';

  @override
  String get onboardingPreferenceEnableAll => '自動的に有効化';

  @override
  String get onboardingPreferenceEnableAllDesc => '新機能が利用可能になり次第アクセスできます';

  @override
  String get onboardingPreferenceKeepSimple => 'シンプルに';

  @override
  String get onboardingPreferenceKeepSimpleDesc => 'どの機能を有効にするか自分で選びます';

  @override
  String get onboardingFeaturesTitle => '体験をカスタマイズ';

  @override
  String get onboardingFeaturesSubtitle => '有効にしたいオプション機能を選択してください';

  @override
  String get onboardingFeatureHobby => '趣味チェックイン';

  @override
  String get onboardingFeatureHobbyDesc => '今日嬉しかったことを共有';

  @override
  String get onboardingFeatureFamily => '家族アクセス';

  @override
  String get onboardingFeatureFamilyDesc => '家族があなたの状態を確認できます';

  @override
  String get onboardingVisualTitle => '視覚的な快適さ';

  @override
  String get onboardingVisualSubtitle => 'お好みに合わせて表示設定を調整';

  @override
  String get onboardingFontSize => 'フォントサイズ';

  @override
  String get onboardingFontSizePreview => 'プレビューテキスト';

  @override
  String get onboardingHighContrast => '高コントラスト';

  @override
  String get onboardingReducedMotion => 'アニメーション軽減';

  @override
  String get onboardingWarmColors => '暖色系';

  @override
  String get onboardingCheckInTitle => '毎日のチェックイン';

  @override
  String get onboardingCheckInSubtitle => '毎日のチェックインで大切な人にあなたの安全を知らせましょう';

  @override
  String get onboardingCheckInHowTo => 'チェックインの方法';

  @override
  String get onboardingCheckInHowToDesc =>
      'ホーム画面のチェックインボタンを1日1回タップするだけ。近況についてメモを追加することもできます。';

  @override
  String get onboardingCheckInDeadline => 'チェックイン期限';

  @override
  String get onboardingCheckInDeadlineDesc =>
      '設定で毎日の期限を設定してください。期限までにチェックインしないと、連絡先に通知が届きます。';

  @override
  String get onboardingCheckInReminder => 'リマインダーを受け取る';

  @override
  String get onboardingCheckInReminderDesc =>
      '毎日のリマインダーを有効にして、チェックインを忘れないようにしましょう。リマインダーの時間はカスタマイズできます。';

  @override
  String get onboardingContactsTitle => '緊急連絡先';

  @override
  String get onboardingContactsSubtitle => 'チェックインを忘れたときに通知を受ける人を追加';

  @override
  String get onboardingContactsAdd => '連絡先を追加';

  @override
  String get onboardingContactsAddDesc => '最大5人の緊急連絡先をメールアドレスと電話番号付きで追加できます。';

  @override
  String get onboardingContactsVerify => '連絡先を確認';

  @override
  String get onboardingContactsVerifyDesc =>
      '連絡先は通知を受け取るためにメールを確認する必要があります。確認リンクが届きます。';

  @override
  String get onboardingContactsAlert => 'アラート通知';

  @override
  String get onboardingContactsAlertDesc =>
      'チェックイン期限を過ぎると、連絡先にメールまたはSMSで通知されます。';

  @override
  String get onboardingContactsPrivacy => 'あなたのプライバシー';

  @override
  String get onboardingContactsPrivacyDesc =>
      '連絡先はチェックインしたかどうかだけを確認でき、メモやその他の詳細は見られません。';

  @override
  String get onboardingCaregiverTitle => '家族と介護者';

  @override
  String get onboardingCaregiverSubtitle => '家族があなたのチェックイン状況を監視できるようにする';

  @override
  String get onboardingCaregiverInvite => '家族を招待';

  @override
  String get onboardingCaregiverInviteDesc =>
      '家族や介護者を招待して、あなたのチェックイン状況を確認し、健康状態を見守ってもらいましょう。';

  @override
  String get onboardingCaregiverQr => 'QRコードで簡単招待';

  @override
  String get onboardingCaregiverQrDesc =>
      'QRコードを共有して簡単に招待。スキャンするだけで参加でき、入力は不要です。';

  @override
  String get onboardingCaregiverMonitor => '状況の監視';

  @override
  String get onboardingCaregiverMonitorDesc =>
      '招待された家族は毎日のチェックイン状況を確認でき、必要に応じてアラートを受け取れます。';

  @override
  String get onboardingCaregiverCheckIn => '代理チェックイン';

  @override
  String get onboardingCaregiverCheckInDesc =>
      '介護者はあなたが自分でチェックインできない場合に代わりにチェックインできます。';

  @override
  String get verifyContactSuccess => 'メール確認完了！';

  @override
  String get verifyContactFailed => '確認に失敗しました';

  @override
  String verifyContactMessage(String contactName, String userName) {
    return '$contactName は $userName の緊急連絡先として確認されました';
  }

  @override
  String get acceptInvitationTitle => '介護者招待';

  @override
  String acceptInvitationMessage(String name) {
    return '$name があなたを介護者として招待しています';
  }

  @override
  String get acceptInvitationFailed => '招待の読み込みに失敗しました';

  @override
  String get acceptInvitationExpired => 'この招待は期限切れです';

  @override
  String get acceptInvitationAlreadyAccepted => 'この招待はすでに承認されています';

  @override
  String get acceptContactLinkTitle => '緊急連絡先リンク';

  @override
  String acceptContactLinkMessage(String name) {
    return '$name があなたを緊急連絡先として追加しました';
  }

  @override
  String get acceptContactLinkFailed => '招待の読み込みに失敗しました';

  @override
  String get errorTitleUser => '入力内容をご確認ください';

  @override
  String get errorTitleSystem => '問題が発生しました';

  @override
  String get errorAuthInvalidCredentials =>
      'メールアドレスまたはパスワードが正しくありません。もう一度お試しください。';

  @override
  String get errorAuthTokenExpired => 'セッションの有効期限が切れました。再度ログインしてください。';

  @override
  String get errorAuthTokenInvalid => 'セッションが無効です。再度ログインしてください。';

  @override
  String get errorAuthUnauthorized => 'このコンテンツにアクセスする権限がありません。';

  @override
  String get errorValidationFailed => '入力内容を確認して、もう一度お試しください。';

  @override
  String get errorValidationEmailInvalid => '有効なメールアドレスを入力してください。';

  @override
  String get errorValidationRequiredField => 'この項目は必須です。';

  @override
  String get errorUserNotFound => 'ユーザーが見つかりません。';

  @override
  String get errorUserEmailExists => 'このメールアドレスは既に登録されています。ログインをお試しください。';

  @override
  String get errorContactNotFound => '連絡先が見つかりません。';

  @override
  String get errorContactLimitReached =>
      '緊急連絡先は最大5件まで登録できます。追加するには、既存の連絡先を削除してください。';

  @override
  String get errorContactEmailExists => 'このメールアドレスは既に連絡先に登録されています。';

  @override
  String get errorCheckinAlreadyToday => '今日はすでにチェックイン済みです。お疲れ様です！';

  @override
  String get errorCheckinSettingsNotFound => 'まずチェックイン設定を行ってください。';

  @override
  String get errorPreferencesNotFound => '設定が見つかりません。設定しましょう！';

  @override
  String get errorPreferencesInvalidFeature => '無効な機能名です。';

  @override
  String get errorNetworkFailed => '接続できません。インターネット接続をご確認ください。';

  @override
  String get errorSystemInternal =>
      '申し訳ございません、システムに問題が発生しました。しばらくしてからもう一度お試しください。';

  @override
  String get errorSystemUnavailable => 'サービスは一時的に利用できません。しばらくしてからもう一度お試しください。';

  @override
  String get errorSystemRateLimited => 'リクエストが多すぎます。しばらくお待ちいただいてからお試しください。';

  @override
  String get errorUnknown => '予期しないエラーが発生しました。もう一度お試しください。';

  @override
  String get statusPending => '待機中';

  @override
  String get statusPendingSubtitle => '下のボタンをタップしてチェックイン';

  @override
  String get statusOverdue => '期限切れ';

  @override
  String get statusOverdueTitle => 'チェックイン期限切れ！';

  @override
  String get statusOverdueSubtitle => '連絡先にまもなく通知される可能性があります';

  @override
  String statusTimeRemaining(String time) {
    return '残り $time';
  }

  @override
  String get checkInNow => '今すぐチェックイン！';

  @override
  String get checkInSuccessTitle => 'チェックイン完了！';

  @override
  String get checkInSuccessMessage => 'お疲れ様です！あなたが無事であることが連絡先に通知されました。';

  @override
  String get checkInSuccessSubtitle => '連絡先にあなたの安全が伝わりました';

  @override
  String get errorTipCheckConnection => 'インターネット接続を確認して、もう一度お試しください。';

  @override
  String get tipPendingTitle => '毎日のチェックイン';

  @override
  String get tipPendingContent => '締め切り前にチェックインして、連絡先にあなたが無事であることを知らせましょう。';

  @override
  String get tipOverdueTitle => 'ご心配なく！';

  @override
  String get tipOverdueContent => '今すぐチェックインできます。連絡先にあなたが無事であることが通知されます。';

  @override
  String get tipCheckedInTitle => '今日は完了！';

  @override
  String get tipCheckedInContent => '次のチェックインは明日です。お気をつけて！';

  @override
  String get offlineModeMessage => 'オフラインです。キャッシュデータを表示しています。';

  @override
  String get offlineCheckInNotAvailable =>
      'オフライン時はチェックインできません。インターネットに接続してください。';

  @override
  String get usingCachedData => 'キャッシュデータを使用中';
}
