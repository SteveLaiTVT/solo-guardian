import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/error_utils.dart';
import '../../data/models/check_in.dart';
import 'core_providers.dart';

class TodayStatusState {
  final TodayStatus? status;
  final bool isLoading;
  final bool isCheckingIn;
  final String? error;
  final String? errorI18nKey;

  const TodayStatusState({
    this.status,
    this.isLoading = false,
    this.isCheckingIn = false,
    this.error,
    this.errorI18nKey,
  });

  TodayStatusState copyWith({
    TodayStatus? status,
    bool? isLoading,
    bool? isCheckingIn,
    String? error,
    String? errorI18nKey,
  }) {
    return TodayStatusState(
      status: status ?? this.status,
      isLoading: isLoading ?? this.isLoading,
      isCheckingIn: isCheckingIn ?? this.isCheckingIn,
      error: error,
      errorI18nKey: errorI18nKey,
    );
  }
}

class TodayStatusNotifier extends StateNotifier<TodayStatusState> {
  final Ref _ref;

  TodayStatusNotifier(this._ref) : super(const TodayStatusState());

  Future<void> loadStatus() async {
    debugPrint('TodayStatusNotifier: Starting loadStatus...');
    state = state.copyWith(isLoading: true, error: null, errorI18nKey: null);
    try {
      final checkInRepo = _ref.read(checkInRepositoryProvider);
      final status = await checkInRepo.getTodayStatus();
      debugPrint('TodayStatusNotifier: Got status, hasCheckedIn=${status.hasCheckedIn}');
      state = TodayStatusState(status: status, isLoading: false);
    } catch (e, stack) {
      debugPrint('TodayStatusNotifier: Error: $e');
      debugPrint('TodayStatusNotifier: Stack: $stack');
      final (errorMsg, i18nKey) = ErrorUtils.extractError(e);
      state = state.copyWith(isLoading: false, error: errorMsg, errorI18nKey: i18nKey);
    }
  }

  Future<void> checkIn({String? note}) async {
    state = state.copyWith(isCheckingIn: true, error: null, errorI18nKey: null);
    try {
      final checkInRepo = _ref.read(checkInRepositoryProvider);
      await checkInRepo.createCheckIn(note: note);
      await loadStatus();
    } catch (e) {
      final (errorMsg, i18nKey) = ErrorUtils.extractError(e);
      state = state.copyWith(isCheckingIn: false, error: errorMsg, errorI18nKey: i18nKey);
      rethrow;
    }
  }
}

final todayStatusProvider =
    StateNotifierProvider<TodayStatusNotifier, TodayStatusState>((ref) {
  return TodayStatusNotifier(ref);
});

class CheckInHistoryState {
  final List<CheckIn> checkIns;
  final int total;
  final int page;
  final bool isLoading;
  final bool hasMore;
  final String? error;
  final String? errorI18nKey;

  const CheckInHistoryState({
    this.checkIns = const [],
    this.total = 0,
    this.page = 1,
    this.isLoading = false,
    this.hasMore = true,
    this.error,
    this.errorI18nKey,
  });

  CheckInHistoryState copyWith({
    List<CheckIn>? checkIns,
    int? total,
    int? page,
    bool? isLoading,
    bool? hasMore,
    String? error,
    String? errorI18nKey,
  }) {
    return CheckInHistoryState(
      checkIns: checkIns ?? this.checkIns,
      total: total ?? this.total,
      page: page ?? this.page,
      isLoading: isLoading ?? this.isLoading,
      hasMore: hasMore ?? this.hasMore,
      error: error,
      errorI18nKey: errorI18nKey,
    );
  }
}

class CheckInHistoryNotifier extends StateNotifier<CheckInHistoryState> {
  final Ref _ref;
  static const _pageSize = 30;

  CheckInHistoryNotifier(this._ref) : super(const CheckInHistoryState());

  Future<void> loadHistory({bool refresh = false}) async {
    if (state.isLoading) return;
    if (!refresh && !state.hasMore) return;

    final page = refresh ? 1 : state.page;
    debugPrint('CheckInHistoryNotifier: Starting loadHistory page=$page refresh=$refresh');
    state = state.copyWith(isLoading: true, error: null, errorI18nKey: null);

    try {
      final checkInRepo = _ref.read(checkInRepositoryProvider);
      final history = await checkInRepo.getHistory(page: page, pageSize: _pageSize);

      final newCheckIns = refresh
          ? history.checkIns
          : [...state.checkIns, ...history.checkIns];

      debugPrint('CheckInHistoryNotifier: Got ${history.checkIns.length} items, total=${history.total}');
      state = CheckInHistoryState(
        checkIns: newCheckIns,
        total: history.total,
        page: page + 1,
        hasMore: newCheckIns.length < history.total,
        isLoading: false,
      );
    } catch (e, stack) {
      debugPrint('CheckInHistoryNotifier: Error: $e');
      debugPrint('CheckInHistoryNotifier: Stack: $stack');
      final (errorMsg, i18nKey) = ErrorUtils.extractError(e);
      state = state.copyWith(isLoading: false, error: errorMsg, errorI18nKey: i18nKey);
    }
  }

  Future<void> refresh() => loadHistory(refresh: true);
}

final checkInHistoryProvider =
    StateNotifierProvider<CheckInHistoryNotifier, CheckInHistoryState>((ref) {
  return CheckInHistoryNotifier(ref);
});
