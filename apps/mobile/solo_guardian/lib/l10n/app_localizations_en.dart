// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'Solo Guardian';

  @override
  String get loading => 'Loading...';

  @override
  String get error => 'An error occurred';

  @override
  String get retry => 'Retry';

  @override
  String get cancel => 'Cancel';

  @override
  String get save => 'Save';

  @override
  String get saving => 'Saving...';

  @override
  String get delete => 'Delete';

  @override
  String get ok => 'OK';

  @override
  String get accept => 'Accept';

  @override
  String get navHome => 'Home';

  @override
  String get navHistory => 'History';

  @override
  String get navCare => 'Care';

  @override
  String get navContacts => 'Contacts';

  @override
  String get navSettings => 'Settings';

  @override
  String get greetingMorning => 'Good morning!';

  @override
  String get greetingAfternoon => 'Good afternoon!';

  @override
  String get greetingEvening => 'Good evening!';

  @override
  String get loginTitle => 'Welcome back';

  @override
  String get loginSubtitle => 'Sign in to your account to continue';

  @override
  String get loginButton => 'Sign in';

  @override
  String get loginLoading => 'Signing in...';

  @override
  String get loginNoAccount => 'Don\'t have an account?';

  @override
  String get loginSignUp => 'Sign up';

  @override
  String get loginFailed => 'Login failed';

  @override
  String get registerTitle => 'Create an account';

  @override
  String get registerSubtitle => 'Enter your details to get started';

  @override
  String get registerButton => 'Create account';

  @override
  String get registerLoading => 'Creating account...';

  @override
  String get registerHasAccount => 'Already have an account?';

  @override
  String get registerSignIn => 'Sign in';

  @override
  String get registerFailed => 'Registration failed';

  @override
  String get registerIdentifiersSection => 'How would you like to sign in?';

  @override
  String get registerIdentifiersHintOptional =>
      'Optional - You can add these later';

  @override
  String get registerNoIdentifierTitle => 'No Login Identifier';

  @override
  String get registerNoIdentifierDescription =>
      'You haven\'t provided a username, email, or phone number. Are you sure you want to continue?';

  @override
  String get registerNoIdentifierCancel => 'Go back';

  @override
  String get registerNoIdentifierConfirm => 'Continue anyway';

  @override
  String get fieldsEmail => 'Email';

  @override
  String get fieldsEmailPlaceholder => 'you@example.com';

  @override
  String get fieldsPassword => 'Password';

  @override
  String get fieldsPasswordPlaceholder => '••••••••';

  @override
  String get fieldsName => 'Name';

  @override
  String get fieldsNamePlaceholder => 'Your name';

  @override
  String get fieldsConfirmPassword => 'Confirm Password';

  @override
  String get fieldsIdentifier => 'Username, Email, Phone, or ID';

  @override
  String get fieldsIdentifierPlaceholder =>
      'Enter username, email, phone, or ID';

  @override
  String get fieldsUsername => 'Username';

  @override
  String get fieldsUsernamePlaceholder => 'Choose a username';

  @override
  String get fieldsPhone => 'Phone Number';

  @override
  String get fieldsPhonePlaceholder => '+1234567890';

  @override
  String get validationEmailInvalid => 'Please enter a valid email';

  @override
  String get validationEmailRequired => 'Email is required';

  @override
  String get validationPasswordRequired => 'Password is required';

  @override
  String get validationPasswordMinLength =>
      'Password must be at least 8 characters';

  @override
  String get validationConfirmRequired => 'Please confirm your password';

  @override
  String get validationPasswordMismatch => 'Passwords do not match';

  @override
  String get validationNameRequired => 'Name is required';

  @override
  String get statusSafe => 'You\'re safe today!';

  @override
  String statusCheckedInAt(String time) {
    return 'Checked in at $time';
  }

  @override
  String statusDeadline(String time) {
    return 'Deadline: $time';
  }

  @override
  String get statusAlreadyCheckedIn => 'Already checked in';

  @override
  String get statusTapToCheckIn => 'Tap the button to check in';

  @override
  String get buttonCheckIn => 'Check In';

  @override
  String get buttonCheckingIn => 'Checking in...';

  @override
  String get historyEmpty => 'No check-in history yet';

  @override
  String get contactsEmpty => 'No emergency contacts yet';

  @override
  String get contactsAdd => 'Add Contact';

  @override
  String get contactsAddTitle => 'Add Emergency Contact';

  @override
  String get contactsLinked => 'Linked';

  @override
  String get contactsDeleteTitle => 'Delete Contact';

  @override
  String contactsDeleteConfirm(String name) {
    return 'Are you sure you want to delete $name?';
  }

  @override
  String get linkedContactsTitle => 'Linked Contacts';

  @override
  String get linkedContactsEmpty => 'No linked contacts';

  @override
  String get linkedContactsPending => 'Pending Invitations';

  @override
  String get linkedContactsActive => 'Active Links';

  @override
  String linkedContactsSince(String date) {
    return 'Since $date';
  }

  @override
  String get settingsCheckIn => 'Check-in Settings';

  @override
  String get settingsCheckInDesc => 'Configure your daily check-in schedule';

  @override
  String get settingsDeadline => 'Daily Deadline';

  @override
  String get settingsDeadlineDesc =>
      'Time by which you need to check in each day';

  @override
  String get settingsReminder => 'Reminder';

  @override
  String get settingsReminderEnabled => 'Enable Reminder';

  @override
  String get settingsReminderEnabledDesc =>
      'Receive a notification before your deadline';

  @override
  String get settingsReminderTime => 'Reminder Time';

  @override
  String get settingsVisual => 'Display Settings';

  @override
  String get settingsVisualDesc => 'Customize appearance and accessibility';

  @override
  String get settingsTheme => 'Color Theme';

  @override
  String get settingsFontSize => 'Text Size';

  @override
  String get settingsHighContrast => 'High Contrast';

  @override
  String get settingsHighContrastDesc =>
      'Increase contrast for better visibility';

  @override
  String get settingsReducedMotion => 'Reduced Motion';

  @override
  String get settingsReducedMotionDesc =>
      'Minimize animations throughout the app';

  @override
  String get settingsLanguage => 'Language';

  @override
  String get settingsAvatarCamera => 'Take Photo';

  @override
  String get settingsAvatarGallery => 'Choose from Gallery';

  @override
  String get settingsAvatarTapToChange => 'Tap avatar to change';

  @override
  String get settingsAvatarSuccess => 'Avatar updated successfully';

  @override
  String get settingsAvatarError => 'Failed to update avatar';

  @override
  String get settingsAccountTitle => 'Account';

  @override
  String get settingsAccountDesc => 'Manage your account settings';

  @override
  String get settingsLogout => 'Sign Out';

  @override
  String get settingsLogoutTitle => 'Sign Out';

  @override
  String get settingsLogoutConfirm => 'Are you sure you want to sign out?';

  @override
  String get settingsEditProfile => 'Edit Profile';

  @override
  String get settingsProfileUpdated => 'Profile updated successfully';

  @override
  String get settingsEditProfileTitle => 'Edit Profile';

  @override
  String get settingsBirthYear => 'Birth Year (Optional)';

  @override
  String get settingsBirthYearHint => 'e.g. 1960';

  @override
  String get settingsBirthYearInvalid => 'Invalid birth year format';

  @override
  String settingsBirthYearRange(String year) {
    return 'Birth year must be between 1900 and $year';
  }

  @override
  String get caregiverElders => 'Elders';

  @override
  String get caregiverCaregivers => 'My Caregivers';

  @override
  String get caregiverEldersEmpty => 'No elders to care for';

  @override
  String get caregiverCaregiversEmpty => 'No caregivers added';

  @override
  String get caregiverStatusCheckedIn => 'Checked in today';

  @override
  String get caregiverStatusPending => 'Pending check-in';

  @override
  String get caregiverStatusOverdue => 'Overdue';

  @override
  String get caregiverCheckIn => 'Check In';

  @override
  String get caregiverCheckInTitle => 'Check In on Behalf';

  @override
  String caregiverCheckInConfirm(String name) {
    return 'Check in on behalf of $name?';
  }

  @override
  String caregiverCheckInSuccess(String name) {
    return 'Checked in for $name';
  }

  @override
  String caregiverDeadline(String time) {
    return 'Deadline: $time';
  }

  @override
  String caregiverPendingAlerts(int count) {
    return '$count pending alerts';
  }

  @override
  String get caregiverInvite => 'Invite Caregiver';

  @override
  String get caregiverInviteTitle => 'Choose Relationship Type';

  @override
  String get caregiverTypeCaregiver => 'Caregiver';

  @override
  String get caregiverTypeFamily => 'Family Member';

  @override
  String get caregiverTypeCaretaker => 'Caretaker';

  @override
  String get caregiverInvitationCreated => 'Invitation Created';

  @override
  String get caregiverShareLink => 'Share this link:';

  @override
  String get onboardingNext => 'Next';

  @override
  String get onboardingBack => 'Back';

  @override
  String get onboardingSkip => 'Skip';

  @override
  String get onboardingComplete => 'Get Started';

  @override
  String get onboardingWelcomeTitle => 'Welcome to Solo Guardian';

  @override
  String get onboardingWelcomeSubtitle =>
      'Your safety companion for peace of mind';

  @override
  String get onboardingProfileTitle => 'About You';

  @override
  String get onboardingProfileSubtitle => 'Help us personalize your experience';

  @override
  String get onboardingBirthYear => 'Year of Birth';

  @override
  String get onboardingBirthYearHint =>
      'This helps us customize content for your age group';

  @override
  String get onboardingBirthYearTap => 'Tap to enter year';

  @override
  String get onboardingBirthYearEnter => 'Enter Year';

  @override
  String get onboardingBirthYearInvalid => 'Please enter a valid year';

  @override
  String get onboardingFinish => 'Finish';

  @override
  String get onboardingSaving => 'Saving...';

  @override
  String get onboardingThemeTitle => 'Choose Your Theme';

  @override
  String get onboardingThemeSubtitle =>
      'Select a color scheme that feels right for you';

  @override
  String get onboardingThemeStandard => 'Standard';

  @override
  String get onboardingThemeWarm => 'Warm';

  @override
  String get onboardingThemeNature => 'Nature';

  @override
  String get onboardingThemeOcean => 'Ocean';

  @override
  String get onboardingPreferenceTitle => 'New Features';

  @override
  String get onboardingPreferenceSubtitle =>
      'When we add new features, how would you like us to handle them?';

  @override
  String get onboardingPreferenceEnableAll => 'Enable automatically';

  @override
  String get onboardingPreferenceEnableAllDesc =>
      'Get access to new features as soon as they\'re available';

  @override
  String get onboardingPreferenceKeepSimple => 'Keep it simple';

  @override
  String get onboardingPreferenceKeepSimpleDesc =>
      'I\'ll choose which features to enable';

  @override
  String get onboardingFeaturesTitle => 'Customize Your Experience';

  @override
  String get onboardingFeaturesSubtitle =>
      'Choose which optional features you\'d like to enable';

  @override
  String get onboardingFeatureHobby => 'Hobby Check-in';

  @override
  String get onboardingFeatureHobbyDesc => 'Share what made you happy today';

  @override
  String get onboardingFeatureFamily => 'Family Access';

  @override
  String get onboardingFeatureFamilyDesc =>
      'Let family members check your status';

  @override
  String get onboardingVisualTitle => 'Visual Comfort';

  @override
  String get onboardingVisualSubtitle =>
      'Adjust the display settings to your preference';

  @override
  String get onboardingFontSize => 'Font Size';

  @override
  String get onboardingFontSizePreview => 'Preview text';

  @override
  String get onboardingHighContrast => 'High Contrast';

  @override
  String get onboardingReducedMotion => 'Reduce Animations';

  @override
  String get onboardingWarmColors => 'Warm Colors';

  @override
  String get onboardingCheckInTitle => 'Daily Check-in';

  @override
  String get onboardingCheckInSubtitle =>
      'Let your loved ones know you\'re safe with a daily check-in';

  @override
  String get onboardingCheckInHowTo => 'How to Check In';

  @override
  String get onboardingCheckInHowToDesc =>
      'Simply tap the check-in button on the home screen once a day. You can also add a note about how you\'re doing.';

  @override
  String get onboardingCheckInDeadline => 'Check-in Deadline';

  @override
  String get onboardingCheckInDeadlineDesc =>
      'Set your daily deadline in Settings. If you don\'t check in by then, your contacts will be notified.';

  @override
  String get onboardingCheckInReminder => 'Get Reminders';

  @override
  String get onboardingCheckInReminderDesc =>
      'Enable daily reminders to help you remember to check in. You can customize the reminder time.';

  @override
  String get onboardingContactsTitle => 'Emergency Contacts';

  @override
  String get onboardingContactsSubtitle =>
      'Add people who will be notified if you miss a check-in';

  @override
  String get onboardingContactsAdd => 'Add Contacts';

  @override
  String get onboardingContactsAddDesc =>
      'Add up to 5 emergency contacts with their email and phone number.';

  @override
  String get onboardingContactsVerify => 'Verify Contacts';

  @override
  String get onboardingContactsVerifyDesc =>
      'Contacts need to verify their email to receive notifications. They\'ll get a confirmation link.';

  @override
  String get onboardingContactsAlert => 'Alert Notifications';

  @override
  String get onboardingContactsAlertDesc =>
      'If you miss your check-in deadline, your contacts will be notified by email or SMS.';

  @override
  String get onboardingContactsPrivacy => 'Your Privacy';

  @override
  String get onboardingContactsPrivacyDesc =>
      'Contacts can only see if you checked in - they cannot see your notes or other details.';

  @override
  String get onboardingCaregiverTitle => 'Family & Caregivers';

  @override
  String get onboardingCaregiverSubtitle =>
      'Let family members monitor your check-in status';

  @override
  String get onboardingCaregiverInvite => 'Invite Family';

  @override
  String get onboardingCaregiverInviteDesc =>
      'Invite family members or caregivers to view your check-in status and help monitor your well-being.';

  @override
  String get onboardingCaregiverQr => 'Quick QR Invite';

  @override
  String get onboardingCaregiverQrDesc =>
      'Share a QR code for easy invitation. They can scan it to join without typing anything.';

  @override
  String get onboardingCaregiverMonitor => 'Status Monitoring';

  @override
  String get onboardingCaregiverMonitorDesc =>
      'Invited family members can see your daily check-in status and receive alerts if needed.';

  @override
  String get onboardingCaregiverCheckIn => 'Caregiver Check-in';

  @override
  String get onboardingCaregiverCheckInDesc =>
      'Caregivers can check in on your behalf if you\'re unable to do it yourself.';

  @override
  String get verifyContactSuccess => 'Email Verified!';

  @override
  String get verifyContactFailed => 'Verification Failed';

  @override
  String verifyContactMessage(String contactName, String userName) {
    return '$contactName has been verified as an emergency contact for $userName';
  }

  @override
  String get acceptInvitationTitle => 'Caregiver Invitation';

  @override
  String acceptInvitationMessage(String name) {
    return '$name has invited you to be their caregiver';
  }

  @override
  String get acceptInvitationFailed => 'Failed to load invitation';

  @override
  String get acceptInvitationExpired => 'This invitation has expired';

  @override
  String get acceptInvitationAlreadyAccepted =>
      'This invitation has already been accepted';

  @override
  String get acceptContactLinkTitle => 'Emergency Contact Link';

  @override
  String acceptContactLinkMessage(String name) {
    return '$name has added you as an emergency contact';
  }

  @override
  String get acceptContactLinkFailed => 'Failed to load invitation';

  @override
  String get errorTitleUser => 'Please check your input';

  @override
  String get errorTitleSystem => 'Something went wrong';

  @override
  String get errorAuthInvalidCredentials =>
      'Email or password is incorrect. Please try again.';

  @override
  String get errorAuthTokenExpired =>
      'Your session has expired. Please log in again.';

  @override
  String get errorAuthTokenInvalid =>
      'Your session is invalid. Please log in again.';

  @override
  String get errorAuthUnauthorized =>
      'You don\'t have permission to access this.';

  @override
  String get errorValidationFailed => 'Please check your input and try again.';

  @override
  String get errorValidationEmailInvalid =>
      'Please enter a valid email address.';

  @override
  String get errorValidationRequiredField => 'This field is required.';

  @override
  String get errorUserNotFound => 'User not found.';

  @override
  String get errorUserEmailExists =>
      'This email is already registered. Try logging in instead.';

  @override
  String get errorContactNotFound => 'Contact not found.';

  @override
  String get errorContactLimitReached =>
      'You can add up to 5 emergency contacts. Please remove one to add another.';

  @override
  String get errorContactEmailExists =>
      'This email is already in your contacts.';

  @override
  String get errorCheckinAlreadyToday =>
      'You\'ve already checked in today. Great job!';

  @override
  String get errorCheckinSettingsNotFound =>
      'Please set up your check-in settings first.';

  @override
  String get errorPreferencesNotFound =>
      'Preferences not found. Let\'s set them up!';

  @override
  String get errorPreferencesInvalidFeature => 'Invalid feature name.';

  @override
  String get errorNetworkFailed =>
      'Unable to connect. Please check your internet connection.';

  @override
  String get errorSystemInternal =>
      'We\'re sorry, something went wrong on our end. Please try again later.';

  @override
  String get errorSystemUnavailable =>
      'Service is temporarily unavailable. Please try again in a few minutes.';

  @override
  String get errorSystemRateLimited =>
      'Too many requests. Please wait a moment and try again.';

  @override
  String get errorUnknown => 'An unexpected error occurred. Please try again.';

  @override
  String get statusPending => 'Pending';

  @override
  String get statusPendingSubtitle => 'Tap the button below to check in';

  @override
  String get statusOverdue => 'Overdue';

  @override
  String get statusOverdueTitle => 'Check-in Overdue!';

  @override
  String get statusOverdueSubtitle => 'Your contacts may be notified soon';

  @override
  String statusTimeRemaining(String time) {
    return '$time remaining';
  }

  @override
  String get checkInNow => 'Check In Now!';

  @override
  String get checkInSuccessTitle => 'Check-in Complete!';

  @override
  String get checkInSuccessMessage =>
      'Great job! Your contacts have been notified that you\'re safe.';

  @override
  String get checkInSuccessSubtitle => 'Your contacts know you\'re safe';

  @override
  String get errorTipCheckConnection =>
      'Please check your internet connection and try again.';

  @override
  String get tipPendingTitle => 'Daily Check-in';

  @override
  String get tipPendingContent =>
      'Check in before your deadline to let your contacts know you\'re safe.';

  @override
  String get tipOverdueTitle => 'Don\'t worry!';

  @override
  String get tipOverdueContent =>
      'You can still check in now. Your contacts will be notified you\'re okay.';

  @override
  String get tipCheckedInTitle => 'All done for today!';

  @override
  String get tipCheckedInContent =>
      'Come back tomorrow for your next check-in. Stay safe!';
}
