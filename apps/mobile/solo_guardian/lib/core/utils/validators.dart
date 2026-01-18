class Validators {
  static final _emailRegex = RegExp(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  );

  static final _usernameRegex = RegExp(
    r'^[a-zA-Z][a-zA-Z0-9_-]*$',
  );

  static final _phoneRegex = RegExp(
    r'^\+?[1-9]\d{1,14}$',
  );

  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) return null;
    if (!_emailRegex.hasMatch(value)) {
      return 'Please enter a valid email';
    }
    return null;
  }

  static String? validateEmailRequired(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    if (!_emailRegex.hasMatch(value)) {
      return 'Please enter a valid email';
    }
    return null;
  }

  static String? validateUsername(String? value) {
    if (value == null || value.isEmpty) return null;
    if (value.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (value.length > 30) {
      return 'Username must be at most 30 characters';
    }
    if (!_usernameRegex.hasMatch(value)) {
      return 'Username must start with a letter and contain only letters, numbers, underscores, or hyphens';
    }
    return null;
  }

  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) return null;
    if (!_phoneRegex.hasMatch(value)) {
      return 'Please enter a valid phone number';
    }
    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return null;
  }

  static String? validateConfirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    if (value != password) {
      return 'Passwords do not match';
    }
    return null;
  }

  static String? validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Name is required';
    }
    if (value.length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (value.length > 100) {
      return 'Name must be at most 100 characters';
    }
    return null;
  }

  static String? validateIdentifier(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your username, email, phone, or ID';
    }
    return null;
  }

  static String? validateBirthYear(String? value) {
    if (value == null || value.isEmpty) return null;
    final year = int.tryParse(value);
    if (year == null) {
      return 'Please enter a valid year';
    }
    final currentYear = DateTime.now().year;
    if (year < 1900 || year > currentYear) {
      return 'Please enter a year between 1900 and $currentYear';
    }
    return null;
  }

  static String? validateOtp(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter the verification code';
    }
    if (value.length != 6) {
      return 'Verification code must be 6 digits';
    }
    if (!RegExp(r'^\d{6}$').hasMatch(value)) {
      return 'Verification code must contain only digits';
    }
    return null;
  }
}
