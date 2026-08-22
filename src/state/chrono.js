import Vue from 'vue'
import { EventBus } from "@/utils/eventBus.js";

import {
	BASE_BONUS,
	ITEM_INTERVALS,
	ENEMY_INTERVALS,
	JOB_INTERVALS
} from "@/data/chrono";

let persistLastSeen = false;

export function enableLastSeenPersist() {
	persistLastSeen = true;
}

export function shouldPersistLastSeen() {
	return persistLastSeen;
}

function formatDuration(duration) {
	var seconds = parseInt((duration / 1000) % 60),
		minutes = parseInt((duration / (1000 * 60)) % 60),
		hours = parseInt((duration / (1000 * 60 * 60)));

	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	return `${hours}:${minutes}:${seconds}`;
}

const chrono = {
	namespaced: true,
	state: {
		desiredSpeed: 1,
		remainingTime: 0,
		currentTimeout: 0,
		lastLogoutTime: 0,
		lastGain: 0,
		lastAway: 0,
		lastExport: 0
	},
	getters: {
		defaultSpeeds() {
			return
		},
		speeds(state, getters, rootState, rootGetters) {
			if (rootGetters["cheats/extraChronoOptions"]) {
				return [1, 1.5, 2, 3, 5, 10, 25, 100, 250, 500, 1000];
			}
			let options = [1, 1.5, 2, 3, 5];
			let upgradeCount = rootGetters["upgrades/get"]("timeBankOptions");
			if (upgradeCount >= 1) options.push(7.5);
			if (upgradeCount >= 2) options.push(10);
			return options;
		},

		desiredSpeed(state) {
			return state.desiredSpeed;
		},
		speed(state, getters) {
			if (getters["active"]) return getters["desiredSpeed"];
			return 1;
		},
		remainingTime(state) {
			return state.remainingTime;
		},
		maxHours(state, getters, rootState, rootGetters) {
			let hours = 12;
			let upgradeCount = rootGetters["upgrades/get"]("timeBankSize");
			if (upgradeCount >= 1) hours += 12;
			if (upgradeCount >= 2) hours += 24;
			return hours;
		},
		maxDuration(state, getters) {
			return getters["maxHours"] * 60 * 60 * 1000;
		},
		active(state, getters, rootState, rootGetters) {
			if (getters["desiredSpeed"] == 1) return false;
			if (rootGetters["isActionChronoProhibited"]) return false;
			if (rootGetters["upgrades/get"]("timeBankAutoPause") && !rootGetters["isAnyAction"]) return false;

			return getters["remainingTime"] > 0 || rootGetters["cheats/infiniteChrono"];
		},
		remainingTimeText(state, getters) {
			return formatDuration(getters["remainingTime"]);
		},
		lastGain(state) {
			return state.lastGain;
		},
		lastAway(state) {
			return state.lastAway || 0;
		},
		lastGainText(state, getters) {
			const cap = getters["maxDuration"];
			const duration = Math.min(Math.max(0, state.lastGain || 0), cap);
			return formatDuration(duration);
		},
		showWelcomeBack(state) {
			return (state.lastAway || 0) >= 60 * 1000;
		},
		showPartnerAd(state) {
			return (state.lastAway || 0) >= 2 * 60 * 60 * 1000;
		},
		previousResetPotential(state, getters, rootState, rootGetters) {
			return rootGetters["completion/getItem"]('bluetime') || 0;
		},
		resetPotential(state, getters, rootState, rootGetters) {
			let sum = BASE_BONUS;
			sum += getters["previousResetPotential"];
			ITEM_INTERVALS.forEach(x => {
				if (x <= rootGetters["completion/itemPercent"]) sum += 1;
			});
			ENEMY_INTERVALS.forEach(x => {
				if (x <= rootGetters["completion/enemyPercent"]) sum += 1;
			});
			JOB_INTERVALS.forEach(x => {
				if (x <= rootGetters["completion/jobPercent"]) sum += 1;
			});
			return sum;
		},
		//returns true if it has been >=23 hours since you last exported your save
		oldExport(state, getters, rootState, rootGetters){
			let hours = parseInt((state.lastExport / (1000 * 60 * 60)));
			if(hours >= 23) return true;
			return false;
		}
	},
	mutations: {
		setDesiredSpeed(state, val) {
			state.desiredSpeed = val;
		},
		addTime(state, val) {
			state.remainingTime += val;
			state.remainingTime = Math.max(state.remainingTime, 0);
			state.remainingTime = Math.min(state.remainingTime, this.getters["chrono/maxDuration"]);
		},
		setLastLogoutTime(state, val) {
			state.lastLogoutTime = val;
		},
		setRemainingTime(state, val) {
			state.remainingTime = Math.max(0, Math.min(val, this.getters["chrono/maxDuration"]));
		}
	},
	actions: {
		_resume({ state, dispatch }) {
			if (!state.currentTimeout) {
				dispatch("_progress");
			}
		},
		_progress({ state, getters, dispatch, rootGetters }, interval) {
			var from = new Date().getTime();

			state.currentTimeout = setTimeout(() => {
				let customInterval = 0;

				if (getters["active"]) {
					var to = new Date().getTime();
					let elapsed = to - from;

					let ratio = getters["desiredSpeed"] - 1;

					if (!rootGetters["cheats/infiniteChrono"]) {
						state.remainingTime = Math.max(0, state.remainingTime - elapsed * ratio);
					}

					customInterval = 1000 / ratio
				}
				dispatch("_progress", customInterval);
			}, interval ? interval : 250);
		},
		updateOfflineTime({ state, getters, commit }, bootStartedAt) {
			if (!state.lastLogoutTime) return;
			const now = typeof bootStartedAt === "number" ? bootStartedAt : Date.now();
			let elapsedTime = now - state.lastLogoutTime;
			if (!Number.isFinite(elapsedTime) || elapsedTime < 0) elapsedTime = 0;
			state.lastAway = elapsedTime;
			const room = Math.max(0, getters["maxDuration"] - state.remainingTime);
			const added = Math.min(elapsedTime, room, getters["maxDuration"]);
			state.lastGain = added;
			state.lastExport = Math.min(elapsedTime + state.lastExport, Number.MAX_VALUE);
			commit("addTime", added);
			state.lastLogoutTime = Date.now();
		},
		resetLastExport({ state, getters, commit }){
			state.lastExport = 0;
			commit("addTime", 1800000); // 30 minutes
		},
		resetSimulation({ getters, commit, dispatch }) {
			let resetPotential = getters["resetPotential"];
			this.commit("completion/trackReset");
			dispatch("resetData", true, { root: true })
			commit("inventory/changeItemCount", { itemId: "bluetime", count: resetPotential }, { root: true });
		}
	}
}

export default chrono;