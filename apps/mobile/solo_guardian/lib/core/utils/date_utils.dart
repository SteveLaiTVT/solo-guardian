import 'package:intl/intl.dart';

class AppDateUtils {
  static String formatTime(DateTime dateTime) {
    return DateFormat.jm().format(dateTime);
  }

  static String formatDate(DateTime dateTime) {
    return DateFormat.yMMMd().format(dateTime);
  }

  static String formatDateTime(DateTime dateTime) {
    return DateFormat.yMMMd().add_jm().format(dateTime);
  }

  static String formatRelativeDate(DateTime dateTime) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final date = DateTime(dateTime.year, dateTime.month, dateTime.day);

    if (date == today) {
      return 'Today';
    } else if (date == yesterday) {
      return 'Yesterday';
    } else {
      return formatDate(dateTime);
    }
  }

  static Duration timeUntil(DateTime deadline) {
    return deadline.difference(DateTime.now());
  }

  static String formatCountdown(Duration duration) {
    if (duration.isNegative) {
      final positive = duration.abs();
      final hours = positive.inHours;
      final minutes = positive.inMinutes.remainder(60);
      if (hours > 0) {
        return '${hours}h ${minutes}m overdue';
      }
      return '${minutes}m overdue';
    } else {
      final hours = duration.inHours;
      final minutes = duration.inMinutes.remainder(60);
      if (hours > 0) {
        return '${hours}h ${minutes}m remaining';
      }
      return '${minutes}m remaining';
    }
  }

  static bool isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  static DateTime parseTimeString(String time) {
    final parts = time.split(':');
    final now = DateTime.now();
    return DateTime(
      now.year,
      now.month,
      now.day,
      int.parse(parts[0]),
      int.parse(parts[1]),
    );
  }

  static String getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return 'morning';
    } else if (hour < 17) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  }
}
