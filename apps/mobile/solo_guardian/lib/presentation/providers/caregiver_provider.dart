import 'package:flutter_riverpod/flutter_riverpod.dart';
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
    state = state.copyWith(isLoading: true, error: null);
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      final elders = await caregiverRepo.getElders();
      state = EldersState(elders: elders);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> checkInOnBehalf(String elderId, {String? note}) async {
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      await caregiverRepo.checkInOnBehalf(elderId, note: note);
      await loadElders();
    } catch (e) {
      state = state.copyWith(error: e.toString());
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
    state = state.copyWith(isLoading: true, error: null);
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      final caregivers = await caregiverRepo.getCaregivers();
      state = CaregiversState(caregivers: caregivers);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<InvitationResponse> createInvitation(String relationshipType) async {
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      return await caregiverRepo.createInvitation(relationshipType);
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }

  Future<void> acceptInvitation(String token) async {
    try {
      final caregiverRepo = _ref.read(caregiverRepositoryProvider);
      await caregiverRepo.acceptInvitation(token);
      await loadCaregivers();
    } catch (e) {
      state = state.copyWith(error: e.toString());
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
