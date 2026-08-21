const IS_PROD = process.env.NODE_ENV === "production";

const cheats = {
	namespaced: true,
	state: {
		showAllActions: false,
		unlockAllJobs: false,
		cheatsEnabled: false,
		infiniteChrono: false,
		extraChronoOptions: false
	},
	getters: {
		showAllActions(state) {
			return IS_PROD ? false : state.showAllActions;
		},
		unlockAllJobs(state) {
			return IS_PROD ? false : state.unlockAllJobs;
		},
		cheatsEnabled(state) {
			return IS_PROD ? false : state.cheatsEnabled;
		},
		infiniteChrono(state) {
			return IS_PROD ? false : state.infiniteChrono;
		},
		extraChronoOptions(state) {
			return IS_PROD ? false : state.extraChronoOptions;
		}
	},
	mutations: {
		setShowAllActions(state, val) {
			if (IS_PROD) return;
			state.showAllActions = val;
		},
		setUnlockAllJobs(state, val) {
			if (IS_PROD) return;
			state.unlockAllJobs = val;
		},
		enableCheats(state) {
			if (IS_PROD) return;
			state.cheatsEnabled = true;
		},
		disableCheats(state) {
			state.cheatsEnabled = false;
			state.showAllActions = false;
			state.unlockAllJobs = false;
			state.infiniteChrono = false;
			state.extraChronoOptions = false;
		},
		setInfiniteChrono(state, val) {
			if (IS_PROD) return;
			state.infiniteChrono = val;
		},
		setExtraChronoOptions(state, val) {
			if (IS_PROD) return;
			state.extraChronoOptions = val;
		}
	}
}

export default cheats;