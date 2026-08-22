import Vue from "vue";
import { reducer } from "@/state/store";
import { apiFetch, getSessionToken } from "@/discord/activity";
import { EventBus } from "@/utils/eventBus.js";
import i18n from "@/i18n";

export const cloudState = Vue.observable({
	enabled: false,
	lastSync: 0,
	revision: 0,
	error: "",
	busy: false
});

let autosaveTimer = null;
let lastPushedJson = "";

export async function hydrateFromCloud(store, snapshot) {
	const localLogout = (snapshot && snapshot.lastLogoutTime) || (store.state.chrono && store.state.chrono.lastLogoutTime) || 0;
	const localRemaining = (snapshot && typeof snapshot.remainingTime === "number")
		? snapshot.remainingTime
		: ((store.state.chrono && store.state.chrono.remainingTime) || 0);
	if (!getSessionToken()) {
		cloudState.enabled = false;
		return { ok: false, reason: "no-session", lastSeen: localLogout, remaining: localRemaining };
	}
	cloudState.enabled = true;
	cloudState.busy = true;
	try {
		const response = await apiFetch("/api/save");
		const payload = await response.json();
		if (payload && payload.save) {
			store.dispatch("setData", payload.save);
			const cloudLogout = (payload.save.chrono && payload.save.chrono.lastLogoutTime) || 0;
			const cloudUpdated = Number(payload.updatedAt) || 0;
			const cloudSeen = Math.max(cloudLogout, cloudUpdated);
			const lastSeen = Math.max(localLogout, cloudSeen);
			if (localLogout >= cloudSeen) {
				store.commit("chrono/setRemainingTime", localRemaining);
			}
			store.commit("chrono/setLastLogoutTime", lastSeen);
			cloudState.lastSync = payload.updatedAt || Date.now();
			cloudState.revision = payload.revision || 0;
			lastPushedJson = JSON.stringify(payload.save);
			cloudState.error = "";
			return { ok: true, loaded: true, lastSeen: lastSeen };
		}
		await pushToCloud(store, true);
		return { ok: true, loaded: false, lastSeen: localLogout, remaining: localRemaining };
	} catch (err) {
		cloudState.error = (err && err.message) || "cloud load failed";
		return { ok: false, reason: "error", lastSeen: localLogout, remaining: localRemaining };
	} finally {
		cloudState.busy = false;
	}
}

export async function pushToCloud(store, silent) {
	if (!getSessionToken()) return { ok: false };
	const save = reducer(store.state);
	const json = JSON.stringify(save);
	if (json === lastPushedJson) return { ok: true, skipped: true };

	cloudState.busy = true;
	try {
		const response = await apiFetch("/api/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				save,
				updatedAt: Date.now()
			})
		});
		const payload = await response.json();
		if (response.status === 409 && payload.save) {
			store.dispatch("setData", payload.save);
			cloudState.lastSync = payload.updatedAt || Date.now();
			cloudState.revision = payload.revision || 0;
			lastPushedJson = JSON.stringify(payload.save);
			if (!silent) {
				EventBus.$emit("toast", { text: i18n.t("toast.cloudLoaded"), duration: 2500 });
			}
			return { ok: true, loaded: true, conflict: true };
		}
		if (!response.ok) {
			throw new Error(payload.error || "save failed");
		}
		cloudState.lastSync = payload.updatedAt || Date.now();
		cloudState.revision = payload.revision || 0;
		lastPushedJson = json;
		cloudState.error = "";
		if (!silent) {
			EventBus.$emit("toast", { text: i18n.t("toast.cloudSaved"), duration: 2000 });
		}
		return { ok: true };
	} catch (err) {
		cloudState.error = (err && err.message) || "cloud save failed";
		if (!silent) {
			EventBus.$emit("toast", { text: i18n.t("toast.cloudError"), duration: 3000 });
		}
		return { ok: false };
	} finally {
		cloudState.busy = false;
	}
}

export function startCloudAutosave(store) {
	stopCloudAutosave();
	if (!getSessionToken()) return;
	autosaveTimer = setInterval(function () {
		pushToCloud(store, true);
	}, 15000);

	window.addEventListener("visibilitychange", function () {
		if (document.visibilityState === "hidden") {
			store.commit("chrono/setLastLogoutTime", Date.now());
			pushToCloud(store, true);
		}
	});
	window.addEventListener("pagehide", function () {
		store.commit("chrono/setLastLogoutTime", Date.now());
		pushToCloud(store, true);
	});
}

export function stopCloudAutosave() {
	if (autosaveTimer) {
		clearInterval(autosaveTimer);
		autosaveTimer = null;
	}
}

export function saveSizeBytes(store) {
	try {
		return JSON.stringify(reducer(store.state)).length;
	} catch (err) {
		return 0;
	}
}
