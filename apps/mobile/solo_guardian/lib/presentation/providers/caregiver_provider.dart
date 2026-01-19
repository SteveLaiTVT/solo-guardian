import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/error_utils.dart';
import '../../data/models/caregiver.dart';
import 'core_providers.dart';

class EldersState {
  final List<ElderSummary> elders;
  final bool isLoading;
  final String? error;

  const EldersState({
    this.elders = const [],
    this.isLoading = false,
    this.error,
  });

  EldersState copyWith({
    List<ElderSummary>? elders,
    bool? isLoading,
    String? error,
  }) {
    return EldersState(
      elders: elders ?? this.elders,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class EldersNotifier extends StateNotifier<EldersState> {
  final Ref _ref;

  EldersNotifier(this._ref) : super(const EldersState());

  Future<void> loadElders() async {
    debugPrint('EldersNotifier: Starting loadElders...');
    state = state.copyWith(isLoading: true, error: null);
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      debugPrint('EldersNotifier: Calling getElders...');
      final elders = await caregiverRepo.getElders();
      debugPrint('EldersNotifier: Got ${elders.length} elders');
      state = EldersState(elders: elders, isLoading: false);
    } catch (e, stack) {
      debugPrint('EldersNotifier: Error loading elders: $e');
      debugPrint('EldersNotifier: Stack: $stack');
      state = state.copyWith(isLoading: false, error: ErrorUtils.extractError(e).$1);
    }
    debugPrint('EldersNotifier: loadElders complete, isLoading=${state.isLoading}');
  }

  Future<void> checkInOnBehalf(String elderId, {String? note}) async {
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      await caregiverRepo.checkInOnBehalf(elderId, note: note);
      await loadElders();
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }
}

final eldersProvider =
    StateNotifierProvider<EldersNotifier, EldersState>((ref) {
  return EldersNotifier(ref);
});

class CaregiversState {
  final List<CaregiverSummary> caregivers;
  final bool isLoading;
  final String? error;

  const CaregiversState({
    this.caregivers = const [],
    this.isLoading = false,
    this.error,
  });

  CaregiversState copyWith({
    List<CaregiverSummary>? caregivers,
    bool? isLoading,
    String? error,
  }) {
    return CaregiversState(
      caregivers: caregivers ?? this.caregivers,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class CaregiversNotifier extends StateNotifier<CaregiversState> {
  final Ref _ref;

  CaregiversNotifier(this._ref) : super(const CaregiversState());

  Future<void> loadCaregivers() async {
    debugPrint('CaregiversNotifier: Starting loadCaregivers...');
    state = state.copyWith(isLoading: true, error: null);
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      debugPrint('CaregiversNotifier: Calling getCaregivers...');
      final caregivers = await caregiverRepo.getCaregivers();
      debugPrint('CaregiversNotifier: Got ${caregivers.length} caregivers');
      state = CaregiversState(caregivers: caregivers, isLoading: false);
    } catch (e, stack) {
      debugPrint('CaregiversNotifier: Error loading caregivers: $e');
      debugPrint('CaregiversNotifier: Stack: $stack');
      state = state.copyWith(isLoading: false, error: ErrorUtils.extractError(e).$1);
    }
    debugPrint('CaregiversNotifier: loadCaregivers complete, isLoading=${state.isLoading}');
  }

  Future<InvitationResponse> createInvitation(String relationshipType) async {
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      return await caregiverRepo.createInvitation(relationshipType);
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }

  Future<void> acceptInvitation(String token) async {
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      await caregiverRepo.acceptInvitation(token);
      await loadCaregivers();
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }
}

final caregiversProvider =
    StateNotifierProvider<CaregiversNotifier, CaregiversState>((ref) {
  return CaregiversNotifier(ref);
});

final elderDetailProvider =
    FutureProvider.family<ElderDetail, String>((ref, elderId) async {
  final caregiverRepo = ref.watch(caregiverRepositoryProvider);
  return caregiverRepo.getElderDetail(elderId);
});

final elderNotesProvider =
    FutureProvider.family<List<CaregiverNote>, String>((ref, elderId) async {
  final caregiverRepo = ref.watch(caregiverRepositoryProvider);
  return caregiverRepo.getNotes(elderId);
});
