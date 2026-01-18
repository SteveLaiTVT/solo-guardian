import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_ja.dart';
import 'app_localizations_zh.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('ja'),
    Locale('zh'),
  ];

  /// No description provided for @appName.
  ///
  /// In en, this message translates to:
  /// **'Solo Guardian'**
  String get appName;

  /// No description provided for @loading.
  ///
  /// In en, this message translates to:
  /// **'Loading...'**
  String get loading;

  /// No description provided for @error.
  ///
  /// In en, this message translates to:
  /// **'An error occurred'**
  String get error;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @save.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// No description provided for @saving.
  ///
  /// In en, this message translates to:
  /// **'Saving...'**
  String get saving;

  /// No description provided for @delete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get delete;

  /// No description provided for @ok.
  ///
  /// In en, this message translates to:
  /// **'OK'**
  String get ok;

  /// No description provided for @accept.
  ///
  /// In en, this message translates to:
  /// **'Accept'**
  String get accept;

  /// No description provided for @navHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get navHome;

  /// No description provided for @navHistory.
  ///
  /// In en, this message translates to:
  /// **'History'**
  String get navHistory;

  /// No description provided for @navCare.
  ///
  /// In en, this message translates to:
  /// **'Care'**
  String get navCare;

  /// No description provided for @navContacts.
  ///
  /// In en, this message translates to:
  /// **'Contacts'**
  String get navContacts;

  /// No description provided for @navSettings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get navSettings;

  /// No description provided for @greetingMorning.
  ///
  /// In en, this message translates to:
  /// **'Good morning!'**
  String get greetingMorning;

  /// No description provided for @greetingAfternoon.
  ///
  /// In en, this message translates to:
  /// **'Good afternoon!'**
  String get greetingAfternoon;

  /// No description provided for @greetingEvening.
  ///
  /// In en, this message translates to:
  /// **'Good evening!'**
  String get greetingEvening;

  /// No description provided for @loginTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome back'**
  String get loginTitle;

  /// No description provided for @loginSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Sign in to your account to continue'**
  String get loginSubtitle;

  /// No description provided for @loginButton.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get loginButton;

  /// No description provided for @loginLoading.
  ///
  /// In en, this message translates to:
  /// **'Signing in...'**
  String get loginLoading;

  /// No description provided for @loginNoAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account?'**
  String get loginNoAccount;

  /// No description provided for @loginSignUp.
  ///
  /// In en, this message translates to:
  /// **'Sign up'**
  String get loginSignUp;

  /// No description provided for @loginFailed.
  ///
  /// In en, this message translates to:
  /// **'Login failed'**
  String get loginFailed;

  /// No description provided for @registerTitle.
  ///
  /// In en, this message translates to:
  /// **'Create an account'**
  String get registerTitle;

  /// No description provided for @registerSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your details to get started'**
  String get registerSubtitle;

  /// No description provided for @registerButton.
  ///
  /// In en, this message translates to:
  /// **'Create account'**
  String get registerButton;

  /// No description provided for @registerLoading.
  ///
  /// In en, this message translates to:
  /// **'Creating account...'**
  String get registerLoading;

  /// No description provided for @registerHasAccount.
  ///
  /// In en, this message translates to:
  /// **'Already have an account?'**
  String get registerHasAccount;

  /// No description provided for @registerSignIn.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get registerSignIn;

  /// No description provided for @registerFailed.
  ///
  /// In en, this message translates to:
  /// **'Registration failed'**
  String get registerFailed;

  /// No description provided for @registerIdentifiersSection.
  ///
  /// In en, this message translates to:
  /// **'How would you like to sign in?'**
  String get registerIdentifiersSection;

  /// No description provided for @registerIdentifiersHintOptional.
  ///
  /// In en, this message translates to:
  /// **'Optional - You can add these later'**
  String get registerIdentifiersHintOptional;

  /// No description provided for @registerNoIdentifierTitle.
  ///
  /// In en, this message translates to:
  /// **'No Login Identifier'**
  String get registerNoIdentifierTitle;

  /// No description provided for @registerNoIdentifierDescription.
  ///
  /// In en, this message translates to:
  /// **'You haven\'t provided a username, email, or phone number. Are you sure you want to continue?'**
  String get registerNoIdentifierDescription;

  /// No description provided for @registerNoIdentifierCancel.
  ///
  /// In en, this message translates to:
  /// **'Go back'**
  String get registerNoIdentifierCancel;

  /// No description provided for @registerNoIdentifierConfirm.
  ///
  /// In en, this message translates to:
  /// **'Continue anyway'**
  String get registerNoIdentifierConfirm;

  /// No description provided for @fieldsEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get fieldsEmail;

  /// No description provided for @fieldsEmailPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'you@example.com'**
  String get fieldsEmailPlaceholder;

  /// No description provided for @fieldsPassword.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get fieldsPassword;

  /// No description provided for @fieldsPasswordPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'••••••••'**
  String get fieldsPasswordPlaceholder;

  /// No description provided for @fieldsName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get fieldsName;

  /// No description provided for @fieldsNamePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Your name'**
  String get fieldsNamePlaceholder;

  /// No description provided for @fieldsConfirmPassword.
  ///
  /// In en, this message translates to:
  /// **'Confirm Password'**
  String get fieldsConfirmPassword;

  /// No description provided for @fieldsIdentifier.
  ///
  /// In en, this message translates to:
  /// **'Username, Email, Phone, or ID'**
  String get fieldsIdentifier;

  /// No description provided for @fieldsIdentifierPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Enter username, email, phone, or ID'**
  String get fieldsIdentifierPlaceholder;

  /// No description provided for @fieldsUsername.
  ///
  /// In en, this message translates to:
  /// **'Username'**
  String get fieldsUsername;

  /// No description provided for @fieldsUsernamePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Choose a username'**
  String get fieldsUsernamePlaceholder;

  /// No description provided for @fieldsPhone.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get fieldsPhone;

  /// No description provided for @fieldsPhonePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'+1234567890'**
  String get fieldsPhonePlaceholder;

  /// No description provided for @validationEmailInvalid.
  ///
  /// In en, this message translates to:
  /// **'Please enter a valid email'**
  String get validationEmailInvalid;

  /// No description provided for @validationEmailRequired.
  ///
  /// In en, this message translates to:
  /// **'Email is required'**
  String get validationEmailRequired;

  /// No description provided for @validationPasswordRequired.
  ///
  /// In en, this message translates to:
  /// **'Password is required'**
  String get validationPasswordRequired;

  /// No description provided for @validationPasswordMinLength.
  ///
  /// In en, this message translates to:
  /// **'Password must be at least 8 characters'**
  String get validationPasswordMinLength;

  /// No description provided for @validationConfirmRequired.
  ///
  /// In en, this message translates to:
  /// **'Please confirm your password'**
  String get validationConfirmRequired;

  /// No description provided for @validationPasswordMismatch.
  ///
  /// In en, this message translates to:
  /// **'Passwords do not match'**
  String get validationPasswordMismatch;

  /// No description provided for @validationNameRequired.
  ///
  /// In en, this message translates to:
  /// **'Name is required'**
  String get validationNameRequired;

  /// No description provided for @statusSafe.
  ///
  /// In en, this message translates to:
  /// **'You\'re safe today!'**
  String get statusSafe;

  /// No description provided for @statusCheckedInAt.
  ///
  /// In en, this message translates to:
  /// **'Checked in at {time}'**
  String statusCheckedInAt(String time);

  /// No description provided for @statusDeadline.
  ///
  /// In en, this message translates to:
  /// **'Deadline: {time}'**
  String statusDeadline(String time);

  /// No description provided for @statusAlreadyCheckedIn.
  ///
  /// In en, this message translates to:
  /// **'Already checked in'**
  String get statusAlreadyCheckedIn;

  /// No description provided for @statusTapToCheckIn.
  ///
  /// In en, this message translates to:
  /// **'Tap the button to check in'**
  String get statusTapToCheckIn;

  /// No description provided for @buttonCheckIn.
  ///
  /// In en, this message translates to:
  /// **'Check In'**
  String get buttonCheckIn;

  /// No description provided for @buttonCheckingIn.
  ///
  /// In en, this message translates to:
  /// **'Checking in...'**
  String get buttonCheckingIn;

  /// No description provided for @historyEmpty.
  ///
  /// In en, this message translates to:
  /// **'No check-in history yet'**
  String get historyEmpty;

  /// No description provided for @contactsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No emergency contacts yet'**
  String get contactsEmpty;

  /// No description provided for @contactsAdd.
  ///
  /// In en, this message translates to:
  /// **'Add Contact'**
  String get contactsAdd;

  /// No description provided for @contactsAddTitle.
  ///
  /// In en, this message translates to:
  /// **'Add Emergency Contact'**
  String get contactsAddTitle;

  /// No description provided for @contactsLinked.
  ///
  /// In en, this message translates to:
  /// **'Linked'**
  String get contactsLinked;

  /// No description provided for @contactsDeleteTitle.
  ///
  /// In en, this message translates to:
  /// **'Delete Contact'**
  String get contactsDeleteTitle;

  /// No description provided for @contactsDeleteConfirm.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete {name}?'**
  String contactsDeleteConfirm(String name);

  /// No description provided for @linkedContactsTitle.
  ///
  /// In en, this message translates to:
  /// **'Linked Contacts'**
  String get linkedContactsTitle;

  /// No description provided for @linkedContactsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No linked contacts'**
  String get linkedContactsEmpty;

  /// No description provided for @linkedContactsPending.
  ///
  /// In en, this message translates to:
  /// **'Pending Invitations'**
  String get linkedContactsPending;

  /// No description provided for @linkedContactsActive.
  ///
  /// In en, this message translates to:
  /// **'Active Links'**
  String get linkedContactsActive;

  /// No description provided for @linkedContactsSince.
  ///
  /// In en, this message translates to:
  /// **'Since {date}'**
  String linkedContactsSince(String date);

  /// No description provided for @settingsCheckIn.
  ///
  /// In en, this message translates to:
  /// **'Check-in Settings'**
  String get settingsCheckIn;

  /// No description provided for @settingsCheckInDesc.
  ///
  /// In en, this message translates to:
  /// **'Configure your daily check-in schedule'**
  String get settingsCheckInDesc;

  /// No description provided for @settingsDeadline.
  ///
  /// In en, this message translates to:
  /// **'Daily Deadline'**
  String get settingsDeadline;

  /// No description provided for @settingsDeadlineDesc.
  ///
  /// In en, this message translates to:
  /// **'Time by which you need to check in each day'**
  String get settingsDeadlineDesc;

  /// No description provided for @settingsReminder.
  ///
  /// In en, this message translates to:
  /// **'Reminder'**
  String get settingsReminder;

  /// No description provided for @settingsReminderEnabled.
  ///
  /// In en, this message translates to:
  /// **'Enable Reminder'**
  String get settingsReminderEnabled;

  /// No description provided for @settingsReminderEnabledDesc.
  ///
  /// In en, this message translates to:
  /// **'Receive a notification before your deadline'**
  String get settingsReminderEnabledDesc;

  /// No description provided for @settingsReminderTime.
  ///
  /// In en, this message translates to:
  /// **'Reminder Time'**
  String get settingsReminderTime;

  /// No description provided for @settingsVisual.
  ///
  /// In en, this message translates to:
  /// **'Display Settings'**
  String get settingsVisual;

  /// No description provided for @settingsVisualDesc.
  ///
  /// In en, this message translates to:
  /// **'Customize appearance and accessibility'**
  String get settingsVisualDesc;

  /// No description provided for @settingsTheme.
  ///
  /// In en, this message translates to:
  /// **'Color Theme'**
  String get settingsTheme;

  /// No description provided for @settingsFontSize.
  ///
  /// In en, this message translates to:
  /// **'Text Size'**
  String get settingsFontSize;

  /// No description provided for @settingsHighContrast.
  ///
  /// In en, this message translates to:
  /// **'High Contrast'**
  String get settingsHighContrast;

  /// No description provided for @settingsHighContrastDesc.
  ///
  /// In en, this message translates to:
  /// **'Increase contrast for better visibility'**
  String get settingsHighContrastDesc;

  /// No description provided for @settingsReducedMotion.
  ///
  /// In en, this message translates to:
  /// **'Reduced Motion'**
  String get settingsReducedMotion;

  /// No description provided for @settingsReducedMotionDesc.
  ///
  /// In en, this message translates to:
  /// **'Minimize animations throughout the app'**
  String get settingsReducedMotionDesc;

  /// No description provided for @settingsLanguage.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get settingsLanguage;

  /// No description provided for @settingsAvatarCamera.
  ///
  /// In en, this message translates to:
  /// **'Take Photo'**
  String get settingsAvatarCamera;

  /// No description provided for @settingsAvatarGallery.
  ///
  /// In en, this message translates to:
  /// **'Choose from Gallery'**
  String get settingsAvatarGallery;

  /// No description provided for @settingsAvatarTapToChange.
  ///
  /// In en, this message translates to:
  /// **'Tap avatar to change'**
  String get settingsAvatarTapToChange;

  /// No description provided for @settingsAvatarSuccess.
  ///
  /// In en, this message translates to:
  /// **'Avatar updated successfully'**
  String get settingsAvatarSuccess;

  /// No description provided for @settingsAvatarError.
  ///
  /// In en, this message translates to:
  /// **'Failed to update avatar'**
  String get settingsAvatarError;

  /// No description provided for @settingsAccountTitle.
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get settingsAccountTitle;

  /// No description provided for @settingsAccountDesc.
  ///
  /// In en, this message translates to:
  /// **'Manage your account settings'**
  String get settingsAccountDesc;

  /// No description provided for @settingsLogout.
  ///
  /// In en, this message translates to:
  /// **'Sign Out'**
  String get settingsLogout;

  /// No description provided for @settingsLogoutTitle.
  ///
  /// In en, this message translates to:
  /// **'Sign Out'**
  String get settingsLogoutTitle;

  /// No description provided for @settingsLogoutConfirm.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to sign out?'**
  String get settingsLogoutConfirm;

  /// No description provided for @settingsEditProfile.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get settingsEditProfile;

  /// No description provided for @settingsProfileUpdated.
  ///
  /// In en, this message translates to:
  /// **'Profile updated successfully'**
  String get settingsProfileUpdated;

  /// No description provided for @settingsEditProfileTitle.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get settingsEditProfileTitle;

  /// No description provided for @settingsBirthYear.
  ///
  /// In en, this message translates to:
  /// **'Birth Year (Optional)'**
  String get settingsBirthYear;

  /// No description provided for @settingsBirthYearHint.
  ///
  /// In en, this message translates to:
  /// **'e.g. 1960'**
  String get settingsBirthYearHint;

  /// No description provided for @settingsBirthYearInvalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid birth year format'**
  String get settingsBirthYearInvalid;

  /// No description provided for @settingsBirthYearRange.
  ///
  /// In en, this message translates to:
  /// **'Birth year must be between 1900 and {year}'**
  String settingsBirthYearRange(String year);

  /// No description provided for @caregiverElders.
  ///
  /// In en, this message translates to:
  /// **'Elders'**
  String get caregiverElders;

  /// No description provided for @caregiverCaregivers.
  ///
  /// In en, this message translates to:
  /// **'My Caregivers'**
  String get caregiverCaregivers;

  /// No description provided for @caregiverEldersEmpty.
  ///
  /// In en, this message translates to:
  /// **'No elders to care for'**
  String get caregiverEldersEmpty;

  /// No description provided for @caregiverCaregiversEmpty.
  ///
  /// In en, this message translates to:
  /// **'No caregivers added'**
  String get caregiverCaregiversEmpty;

  /// No description provided for @caregiverStatusCheckedIn.
  ///
  /// In en, this message translates to:
  /// **'Checked in today'**
  String get caregiverStatusCheckedIn;

  /// No description provided for @caregiverStatusPending.
  ///
  /// In en, this message translates to:
  /// **'Pending check-in'**
  String get caregiverStatusPending;

  /// No description provided for @caregiverStatusOverdue.
  ///
  /// In en, this message translates to:
  /// **'Overdue'**
  String get caregiverStatusOverdue;

  /// No description provided for @caregiverCheckIn.
  ///
  /// In en, this message translates to:
  /// **'Check In'**
  String get caregiverCheckIn;

  /// No description provided for @caregiverCheckInTitle.
  ///
  /// In en, this message translates to:
  /// **'Check In on Behalf'**
  String get caregiverCheckInTitle;

  /// No description provided for @caregiverCheckInConfirm.
  ///
  /// In en, this message translates to:
  /// **'Check in on behalf of {name}?'**
  String caregiverCheckInConfirm(String name);

  /// No description provided for @caregiverCheckInSuccess.
  ///
  /// In en, this message translates to:
  /// **'Checked in for {name}'**
  String caregiverCheckInSuccess(String name);

  /// No description provided for @caregiverDeadline.
  ///
  /// In en, this message translates to:
  /// **'Deadline: {time}'**
  String caregiverDeadline(String time);

  /// No description provided for @caregiverPendingAlerts.
  ///
  /// In en, this message translates to:
  /// **'{count} pending alerts'**
  String caregiverPendingAlerts(int count);

  /// No description provided for @caregiverInvite.
  ///
  /// In en, this message translates to:
  /// **'Invite Caregiver'**
  String get caregiverInvite;

  /// No description provided for @caregiverInviteTitle.
  ///
  /// In en, this message translates to:
  /// **'Choose Relationship Type'**
  String get caregiverInviteTitle;

  /// No description provided for @caregiverTypeCaregiver.
  ///
  /// In en, this message translates to:
  /// **'Caregiver'**
  String get caregiverTypeCaregiver;

  /// No description provided for @caregiverTypeFamily.
  ///
  /// In en, this message translates to:
  /// **'Family Member'**
  String get caregiverTypeFamily;

  /// No description provided for @caregiverTypeCaretaker.
  ///
  /// In en, this message translates to:
  /// **'Caretaker'**
  String get caregiverTypeCaretaker;

  /// No description provided for @caregiverInvitationCreated.
  ///
  /// In en, this message translates to:
  /// **'Invitation Created'**
  String get caregiverInvitationCreated;

  /// No description provided for @caregiverShareLink.
  ///
  /// In en, this message translates to:
  /// **'Share this link:'**
  String get caregiverShareLink;

  /// No description provided for @onboardingNext.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get onboardingNext;

  /// No description provided for @onboardingBack.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get onboardingBack;

  /// No description provided for @onboardingSkip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get onboardingSkip;

  /// No description provided for @onboardingComplete.
  ///
  /// In en, this message translates to:
  /// **'Get Started'**
  String get onboardingComplete;

  /// No description provided for @onboardingWelcomeTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome to Solo Guardian'**
  String get onboardingWelcomeTitle;

  /// No description provided for @onboardingWelcomeSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Your safety companion for peace of mind'**
  String get onboardingWelcomeSubtitle;

  /// No description provided for @onboardingProfileTitle.
  ///
  /// In en, this message translates to:
  /// **'About You'**
  String get onboardingProfileTitle;

  /// No description provided for @onboardingProfileSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Help us personalize your experience'**
  String get onboardingProfileSubtitle;

  /// No description provided for @onboardingBirthYear.
  ///
  /// In en, this message translates to:
  /// **'Year of Birth'**
  String get onboardingBirthYear;

  /// No description provided for @onboardingBirthYearHint.
  ///
  /// In en, this message translates to:
  /// **'This helps us customize content for your age group'**
  String get onboardingBirthYearHint;

  /// No description provided for @onboardingBirthYearTap.
  ///
  /// In en, this message translates to:
  /// **'Tap to enter year'**
  String get onboardingBirthYearTap;

  /// No description provided for @onboardingBirthYearEnter.
  ///
  /// In en, this message translates to:
  /// **'Enter Year'**
  String get onboardingBirthYearEnter;

  /// No description provided for @onboardingBirthYearInvalid.
  ///
  /// In en, this message translates to:
  /// **'Please enter a valid year'**
  String get onboardingBirthYearInvalid;

  /// No description provided for @onboardingFinish.
  ///
  /// In en, this message translates to:
  /// **'Finish'**
  String get onboardingFinish;

  /// No description provided for @onboardingSaving.
  ///
  /// In en, this message translates to:
  /// **'Saving...'**
  String get onboardingSaving;

  /// No description provided for @onboardingThemeTitle.
  ///
  /// In en, this message translates to:
  /// **'Choose Your Theme'**
  String get onboardingThemeTitle;

  /// No description provided for @onboardingThemeSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Select a color scheme that feels right for you'**
  String get onboardingThemeSubtitle;

  /// No description provided for @onboardingThemeStandard.
  ///
  /// In en, this message translates to:
  /// **'Standard'**
  String get onboardingThemeStandard;

  /// No description provided for @onboardingThemeWarm.
  ///
  /// In en, this message translates to:
  /// **'Warm'**
  String get onboardingThemeWarm;

  /// No description provided for @onboardingThemeNature.
  ///
  /// In en, this message translates to:
  /// **'Nature'**
  String get onboardingThemeNature;

  /// No description provided for @onboardingThemeOcean.
  ///
  /// In en, this message translates to:
  /// **'Ocean'**
  String get onboardingThemeOcean;

  /// No description provided for @onboardingPreferenceTitle.
  ///
  /// In en, this message translates to:
  /// **'New Features'**
  String get onboardingPreferenceTitle;

  /// No description provided for @onboardingPreferenceSubtitle.
  ///
  /// In en, this message translates to:
  /// **'When we add new features, how would you like us to handle them?'**
  String get onboardingPreferenceSubtitle;

  /// No description provided for @onboardingPreferenceEnableAll.
  ///
  /// In en, this message translates to:
  /// **'Enable automatically'**
  String get onboardingPreferenceEnableAll;

  /// No description provided for @onboardingPreferenceEnableAllDesc.
  ///
  /// In en, this message translates to:
  /// **'Get access to new features as soon as they\'re available'**
  String get onboardingPreferenceEnableAllDesc;

  /// No description provided for @onboardingPreferenceKeepSimple.
  ///
  /// In en, this message translates to:
  /// **'Keep it simple'**
  String get onboardingPreferenceKeepSimple;

  /// No description provided for @onboardingPreferenceKeepSimpleDesc.
  ///
  /// In en, this message translates to:
  /// **'I\'ll choose which features to enable'**
  String get onboardingPreferenceKeepSimpleDesc;

  /// No description provided for @onboardingFeaturesTitle.
  ///
  /// In en, this message translates to:
  /// **'Customize Your Experience'**
  String get onboardingFeaturesTitle;

  /// No description provided for @onboardingFeaturesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Choose which optional features you\'d like to enable'**
  String get onboardingFeaturesSubtitle;

  /// No description provided for @onboardingFeatureHobby.
  ///
  /// In en, this message translates to:
  /// **'Hobby Check-in'**
  String get onboardingFeatureHobby;

  /// No description provided for @onboardingFeatureHobbyDesc.
  ///
  /// In en, this message translates to:
  /// **'Share what made you happy today'**
  String get onboardingFeatureHobbyDesc;

  /// No description provided for @onboardingFeatureFamily.
  ///
  /// In en, this message translates to:
  /// **'Family Access'**
  String get onboardingFeatureFamily;

  /// No description provided for @onboardingFeatureFamilyDesc.
  ///
  /// In en, this message translates to:
  /// **'Let family members check your status'**
  String get onboardingFeatureFamilyDesc;

  /// No description provided for @onboardingVisualTitle.
  ///
  /// In en, this message translates to:
  /// **'Visual Comfort'**
  String get onboardingVisualTitle;

  /// No description provided for @onboardingVisualSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Adjust the display settings to your preference'**
  String get onboardingVisualSubtitle;

  /// No description provided for @onboardingFontSize.
  ///
  /// In en, this message translates to:
  /// **'Font Size'**
  String get onboardingFontSize;

  /// No description provided for @onboardingFontSizePreview.
  ///
  /// In en, this message translates to:
  /// **'Preview text'**
  String get onboardingFontSizePreview;

  /// No description provided for @onboardingHighContrast.
  ///
  /// In en, this message translates to:
  /// **'High Contrast'**
  String get onboardingHighContrast;

  /// No description provided for @onboardingReducedMotion.
  ///
  /// In en, this message translates to:
  /// **'Reduce Animations'**
  String get onboardingReducedMotion;

  /// No description provided for @onboardingWarmColors.
  ///
  /// In en, this message translates to:
  /// **'Warm Colors'**
  String get onboardingWarmColors;

  /// No description provided for @onboardingCheckInTitle.
  ///
  /// In en, this message translates to:
  /// **'Daily Check-in'**
  String get onboardingCheckInTitle;

  /// No description provided for @onboardingCheckInSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Let your loved ones know you\'re safe with a daily check-in'**
  String get onboardingCheckInSubtitle;

  /// No description provided for @onboardingCheckInHowTo.
  ///
  /// In en, this message translates to:
  /// **'How to Check In'**
  String get onboardingCheckInHowTo;

  /// No description provided for @onboardingCheckInHowToDesc.
  ///
  /// In en, this message translates to:
  /// **'Simply tap the check-in button on the home screen once a day. You can also add a note about how you\'re doing.'**
  String get onboardingCheckInHowToDesc;

  /// No description provided for @onboardingCheckInDeadline.
  ///
  /// In en, this message translates to:
  /// **'Check-in Deadline'**
  String get onboardingCheckInDeadline;

  /// No description provided for @onboardingCheckInDeadlineDesc.
  ///
  /// In en, this message translates to:
  /// **'Set your daily deadline in Settings. If you don\'t check in by then, your contacts will be notified.'**
  String get onboardingCheckInDeadlineDesc;

  /// No description provided for @onboardingCheckInReminder.
  ///
  /// In en, this message translates to:
  /// **'Get Reminders'**
  String get onboardingCheckInReminder;

  /// No description provided for @onboardingCheckInReminderDesc.
  ///
  /// In en, this message translates to:
  /// **'Enable daily reminders to help you remember to check in. You can customize the reminder time.'**
  String get onboardingCheckInReminderDesc;

  /// No description provided for @onboardingContactsTitle.
  ///
  /// In en, this message translates to:
  /// **'Emergency Contacts'**
  String get onboardingContactsTitle;

  /// No description provided for @onboardingContactsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Add people who will be notified if you miss a check-in'**
  String get onboardingContactsSubtitle;

  /// No description provided for @onboardingContactsAdd.
  ///
  /// In en, this message translates to:
  /// **'Add Contacts'**
  String get onboardingContactsAdd;

  /// No description provided for @onboardingContactsAddDesc.
  ///
  /// In en, this message translates to:
  /// **'Add up to 5 emergency contacts with their email and phone number.'**
  String get onboardingContactsAddDesc;

  /// No description provided for @onboardingContactsVerify.
  ///
  /// In en, this message translates to:
  /// **'Verify Contacts'**
  String get onboardingContactsVerify;

  /// No description provided for @onboardingContactsVerifyDesc.
  ///
  /// In en, this message translates to:
  /// **'Contacts need to verify their email to receive notifications. They\'ll get a confirmation link.'**
  String get onboardingContactsVerifyDesc;

  /// No description provided for @onboardingContactsAlert.
  ///
  /// In en, this message translates to:
  /// **'Alert Notifications'**
  String get onboardingContactsAlert;

  /// No description provided for @onboardingContactsAlertDesc.
  ///
  /// In en, this message translates to:
  /// **'If you miss your check-in deadline, your contacts will be notified by email or SMS.'**
  String get onboardingContactsAlertDesc;

  /// No description provided for @onboardingContactsPrivacy.
  ///
  /// In en, this message translates to:
  /// **'Your Privacy'**
  String get onboardingContactsPrivacy;

  /// No description provided for @onboardingContactsPrivacyDesc.
  ///
  /// In en, this message translates to:
  /// **'Contacts can only see if you checked in - they cannot see your notes or other details.'**
  String get onboardingContactsPrivacyDesc;

  /// No description provided for @onboardingCaregiverTitle.
  ///
  /// In en, this message translates to:
  /// **'Family & Caregivers'**
  String get onboardingCaregiverTitle;

  /// No description provided for @onboardingCaregiverSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Let family members monitor your check-in status'**
  String get onboardingCaregiverSubtitle;

  /// No description provided for @onboardingCaregiverInvite.
  ///
  /// In en, this message translates to:
  /// **'Invite Family'**
  String get onboardingCaregiverInvite;

  /// No description provided for @onboardingCaregiverInviteDesc.
  ///
  /// In en, this message translates to:
  /// **'Invite family members or caregivers to view your check-in status and help monitor your well-being.'**
  String get onboardingCaregiverInviteDesc;

  /// No description provided for @onboardingCaregiverQr.
  ///
  /// In en, this message translates to:
  /// **'Quick QR Invite'**
  String get onboardingCaregiverQr;

  /// No description provided for @onboardingCaregiverQrDesc.
  ///
  /// In en, this message translates to:
  /// **'Share a QR code for easy invitation. They can scan it to join without typing anything.'**
  String get onboardingCaregiverQrDesc;

  /// No description provided for @onboardingCaregiverMonitor.
  ///
  /// In en, this message translates to:
  /// **'Status Monitoring'**
  String get onboardingCaregiverMonitor;

  /// No description provided for @onboardingCaregiverMonitorDesc.
  ///
  /// In en, this message translates to:
  /// **'Invited family members can see your daily check-in status and receive alerts if needed.'**
  String get onboardingCaregiverMonitorDesc;

  /// No description provided for @onboardingCaregiverCheckIn.
  ///
  /// In en, this message translates to:
  /// **'Caregiver Check-in'**
  String get onboardingCaregiverCheckIn;

  /// No description provided for @onboardingCaregiverCheckInDesc.
  ///
  /// In en, this message translates to:
  /// **'Caregivers can check in on your behalf if you\'re unable to do it yourself.'**
  String get onboardingCaregiverCheckInDesc;

  /// No description provided for @verifyContactSuccess.
  ///
  /// In en, this message translates to:
  /// **'Email Verified!'**
  String get verifyContactSuccess;

  /// No description provided for @verifyContactFailed.
  ///
  /// In en, this message translates to:
  /// **'Verification Failed'**
  String get verifyContactFailed;

  /// No description provided for @verifyContactMessage.
  ///
  /// In en, this message translates to:
  /// **'{contactName} has been verified as an emergency contact for {userName}'**
  String verifyContactMessage(String contactName, String userName);

  /// No description provided for @acceptInvitationTitle.
  ///
  /// In en, this message translates to:
  /// **'Caregiver Invitation'**
  String get acceptInvitationTitle;

  /// No description provided for @acceptInvitationMessage.
  ///
  /// In en, this message translates to:
  /// **'{name} has invited you to be their caregiver'**
  String acceptInvitationMessage(String name);

  /// No description provided for @acceptInvitationFailed.
  ///
  /// In en, this message translates to:
  /// **'Failed to load invitation'**
  String get acceptInvitationFailed;

  /// No description provided for @acceptInvitationExpired.
  ///
  /// In en, this message translates to:
  /// **'This invitation has expired'**
  String get acceptInvitationExpired;

  /// No description provided for @acceptInvitationAlreadyAccepted.
  ///
  /// In en, this message translates to:
  /// **'This invitation has already been accepted'**
  String get acceptInvitationAlreadyAccepted;

  /// No description provided for @acceptContactLinkTitle.
  ///
  /// In en, this message translates to:
  /// **'Emergency Contact Link'**
  String get acceptContactLinkTitle;

  /// No description provided for @acceptContactLinkMessage.
  ///
  /// In en, this message translates to:
  /// **'{name} has added you as an emergency contact'**
  String acceptContactLinkMessage(String name);

  /// No description provided for @acceptContactLinkFailed.
  ///
  /// In en, this message translates to:
  /// **'Failed to load invitation'**
  String get acceptContactLinkFailed;

  /// No description provided for @errorTitleUser.
  ///
  /// In en, this message translates to:
  /// **'Please check your input'**
  String get errorTitleUser;

  /// No description provided for @errorTitleSystem.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong'**
  String get errorTitleSystem;

  /// No description provided for @errorAuthInvalidCredentials.
  ///
  /// In en, this message translates to:
  /// **'Email or password is incorrect. Please try again.'**
  String get errorAuthInvalidCredentials;

  /// No description provided for @errorAuthTokenExpired.
  ///
  /// In en, this message translates to:
  /// **'Your session has expired. Please log in again.'**
  String get errorAuthTokenExpired;

  /// No description provided for @errorAuthTokenInvalid.
  ///
  /// In en, this message translates to:
  /// **'Your session is invalid. Please log in again.'**
  String get errorAuthTokenInvalid;

  /// No description provided for @errorAuthUnauthorized.
  ///
  /// In en, this message translates to:
  /// **'You don\'t have permission to access this.'**
  String get errorAuthUnauthorized;

  /// No description provided for @errorValidationFailed.
  ///
  /// In en, this message translates to:
  /// **'Please check your input and try again.'**
  String get errorValidationFailed;

  /// No description provided for @errorValidationEmailInvalid.
  ///
  /// In en, this message translates to:
  /// **'Please enter a valid email address.'**
  String get errorValidationEmailInvalid;

  /// No description provided for @errorValidationRequiredField.
  ///
  /// In en, this message translates to:
  /// **'This field is required.'**
  String get errorValidationRequiredField;

  /// No description provided for @errorUserNotFound.
  ///
  /// In en, this message translates to:
  /// **'User not found.'**
  String get errorUserNotFound;

  /// No description provided for @errorUserEmailExists.
  ///
  /// In en, this message translates to:
  /// **'This email is already registered. Try logging in instead.'**
  String get errorUserEmailExists;

  /// No description provided for @errorContactNotFound.
  ///
  /// In en, this message translates to:
  /// **'Contact not found.'**
  String get errorContactNotFound;

  /// No description provided for @errorContactLimitReached.
  ///
  /// In en, this message translates to:
  /// **'You can add up to 5 emergency contacts. Please remove one to add another.'**
  String get errorContactLimitReached;

  /// No description provided for @errorContactEmailExists.
  ///
  /// In en, this message translates to:
  /// **'This email is already in your contacts.'**
  String get errorContactEmailExists;

  /// No description provided for @errorCheckinAlreadyToday.
  ///
  /// In en, this message translates to:
  /// **'You\'ve already checked in today. Great job!'**
  String get errorCheckinAlreadyToday;

  /// No description provided for @errorCheckinSettingsNotFound.
  ///
  /// In en, this message translates to:
  /// **'Please set up your check-in settings first.'**
  String get errorCheckinSettingsNotFound;

  /// No description provided for @errorPreferencesNotFound.
  ///
  /// In en, this message translates to:
  /// **'Preferences not found. Let\'s set them up!'**
  String get errorPreferencesNotFound;

  /// No description provided for @errorPreferencesInvalidFeature.
  ///
  /// In en, this message translates to:
  /// **'Invalid feature name.'**
  String get errorPreferencesInvalidFeature;

  /// No description provided for @errorNetworkFailed.
  ///
  /// In en, this message translates to:
  /// **'Unable to connect. Please check your internet connection.'**
  String get errorNetworkFailed;

  /// No description provided for @errorSystemInternal.
  ///
  /// In en, this message translates to:
  /// **'We\'re sorry, something went wrong on our end. Please try again later.'**
  String get errorSystemInternal;

  /// No description provided for @errorSystemUnavailable.
  ///
  /// In en, this message translates to:
  /// **'Service is temporarily unavailable. Please try again in a few minutes.'**
  String get errorSystemUnavailable;

  /// No description provided for @errorSystemRateLimited.
  ///
  /// In en, this message translates to:
  /// **'Too many requests. Please wait a moment and try again.'**
  String get errorSystemRateLimited;

  /// No description provided for @errorUnknown.
  ///
  /// In en, this message translates to:
  /// **'An unexpected error occurred. Please try again.'**
  String get errorUnknown;

  /// No description provided for @statusPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get statusPending;

  /// No description provided for @statusPendingSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Tap the button below to check in'**
  String get statusPendingSubtitle;

  /// No description provided for @statusOverdue.
  ///
  /// In en, this message translates to:
  /// **'Overdue'**
  String get statusOverdue;

  /// No description provided for @statusOverdueTitle.
  ///
  /// In en, this message translates to:
  /// **'Check-in Overdue!'**
  String get statusOverdueTitle;

  /// No description provided for @statusOverdueSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Your contacts may be notified soon'**
  String get statusOverdueSubtitle;

  /// No description provided for @statusTimeRemaining.
  ///
  /// In en, this message translates to:
  /// **'{time} remaining'**
  String statusTimeRemaining(String time);

  /// No description provided for @checkInNow.
  ///
  /// In en, this message translates to:
  /// **'Check In Now!'**
  String get checkInNow;

  /// No description provided for @checkInSuccessTitle.
  ///
  /// In en, this message translates to:
  /// **'Check-in Complete!'**
  String get checkInSuccessTitle;

  /// No description provided for @checkInSuccessMessage.
  ///
  /// In en, this message translates to:
  /// **'Great job! Your contacts have been notified that you\'re safe.'**
  String get checkInSuccessMessage;

  /// No description provided for @checkInSuccessSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Your contacts know you\'re safe'**
  String get checkInSuccessSubtitle;

  /// No description provided for @errorTipCheckConnection.
  ///
  /// In en, this message translates to:
  /// **'Please check your internet connection and try again.'**
  String get errorTipCheckConnection;

  /// No description provided for @tipPendingTitle.
  ///
  /// In en, this message translates to:
  /// **'Daily Check-in'**
  String get tipPendingTitle;

  /// No description provided for @tipPendingContent.
  ///
  /// In en, this message translates to:
  /// **'Check in before your deadline to let your contacts know you\'re safe.'**
  String get tipPendingContent;

  /// No description provided for @tipOverdueTitle.
  ///
  /// In en, this message translates to:
  /// **'Don\'t worry!'**
  String get tipOverdueTitle;

  /// No description provided for @tipOverdueContent.
  ///
  /// In en, this message translates to:
  /// **'You can still check in now. Your contacts will be notified you\'re okay.'**
  String get tipOverdueContent;

  /// No description provided for @tipCheckedInTitle.
  ///
  /// In en, this message translates to:
  /// **'All done for today!'**
  String get tipCheckedInTitle;

  /// No description provided for @tipCheckedInContent.
  ///
  /// In en, this message translates to:
  /// **'Come back tomorrow for your next check-in. Stay safe!'**
  String get tipCheckedInContent;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'ja', 'zh'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'ja':
      return AppLocalizationsJa();
    case 'zh':
      return AppLocalizationsZh();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
