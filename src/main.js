import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/GlobalStyle.css';
import '@/assets/DiscordActivity.css';

import store from "@/state/store.js";
import i18n, { setLocale, detectLocale } from "@/i18n";
import { initDiscordActivity, discordState, isDiscordActivity, fetchSessionUser } from "@/discord/activity";
import { hydrateFromCloud, startCloudAutosave } from "@/state/cloudSave";
import { enableLastSeenPersist } from "@/state/chrono";

import { BPopover } from 'bootstrap-vue'
Vue.component('b-popover', BPopover)

import VModal from 'vue-js-modal'
Vue.use(VModal, { dynamic: true })


Vue.config.productionTip = false

Vue.filter('cleanNum', function (value) {
	if (value == undefined) return "";
	return value.toLocaleString();
})

Vue.filter('stat', function (value) {
	if (value == undefined) return "";
	return +value.toFixed(2);
})
Vue.filter('aggressive', function (value) {
	if (value == undefined) return 0;
	if (value >= 1000 && !store.getters["settings/showFullValues"]) {
		value = Math.min(Math.floor(value / 1000), 9);
		return `>${value}k`;
	}
	return value.toLocaleString();
})

function applyLocale() {
	const saved = store.getters["settings/locale"];
	if (saved === "ru" || saved === "en") {
		setLocale(saved);
		return;
	}
	const user = discordState.user;
	if (user && user.locale && String(user.locale).toLowerCase().indexOf("ru") === 0) {
		setLocale("ru");
		store.commit("settings/setLocale", "ru");
		return;
	}
	const detected = detectLocale();
	setLocale(detected);
	store.commit("settings/setLocale", detected);
}

async function loadConfig() {
	const paths = isDiscordActivity()
		? ["/.proxy/api/config", "/api/config"]
		: ["/api/config"];
	for (let i = 0; i < paths.length; i++) {
		try {
			const response = await fetch(paths[i]);
			if (!response.ok) continue;
			const cfg = await response.json();
			if (cfg) return cfg;
		} catch (err) {
			// try next
		}
	}
	return {};
}

async function bootDebug(cfg) {
	if (process.env.NODE_ENV === "production") return;
	const localPlayer = cfg.localPlayer === true;
	if (!localPlayer || cfg.debug !== true) return;
	const mode = require("@/debug/mode");
	const session = require("@/debug/session");
	mode.persistDebugFlag(true);
	discordState.debug = true;
	store.commit("cheats/enableCheats");
	if (!discordState.sessionToken) {
		try {
			await session.startDebugSession("debug-local");
		} catch (err) {
			console.warn("[debug] session failed", err);
		}
	}
}

async function boot() {
	const bootStartedAt = Date.now();
	const localChrono = {
		lastLogoutTime: (store.state.chrono && store.state.chrono.lastLogoutTime) || 0,
		remainingTime: (store.state.chrono && store.state.chrono.remainingTime) || 0
	};
	const cfg = await loadConfig();
	const localPlayer = cfg.localPlayer === true;
	discordState.localPlayer = localPlayer;

	const inDiscord = isDiscordActivity();
	if (!localPlayer && !inDiscord) {
		applyLocale();
		new Vue({
			store,
			i18n,
			render: h => h(App),
		}).$mount('#app');
		return;
	}

	await initDiscordActivity();
	if (discordState.sessionToken && !discordState.user) {
		await fetchSessionUser();
	}
	await bootDebug(cfg);

	if (process.env.NODE_ENV === "production") {
		discordState.debug = false;
		store.commit("cheats/disableCheats");
	}

	applyLocale();
	await hydrateFromCloud(store, localChrono);
	if (process.env.NODE_ENV === "production" || !localPlayer) {
		store.commit("cheats/disableCheats");
	}

	new Vue({
		store,
		i18n,
		render: h => h(App),
	}).$mount('#app')

	store.dispatch('chrono/updateOfflineTime', bootStartedAt);
	enableLastSeenPersist();
	store.dispatch('research/startupRoll');
	store.dispatch("cleanup");
	store.dispatch("_resume");
	startCloudAutosave(store);
}

boot();
