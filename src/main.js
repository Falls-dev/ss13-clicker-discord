import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/GlobalStyle.css';
import '@/assets/DiscordActivity.css';

import store from "@/state/store.js";
import i18n, { setLocale, detectLocale } from "@/i18n";
import { initDiscordActivity, startDebugSession, discordState, isDiscordActivity } from "@/discord/activity";
import { hydrateFromCloud, startCloudAutosave } from "@/state/cloudSave";
import { isDebugRequested, persistDebugFlag } from "@/debug/mode";

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
	try {
		const cfg = await fetch("/api/config").then(function (r) { return r.json(); });
		return cfg || {};
	} catch (err) {
		return {};
	}
}

async function boot() {
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

	const debugAllowed = localPlayer && (cfg.debug === true || isDebugRequested());
	if (debugAllowed) {
		persistDebugFlag(true);
		discordState.debug = true;
		store.commit("cheats/enableCheats");
		if (!discordState.sessionToken) {
			try {
				await startDebugSession("debug-local");
			} catch (err) {
				console.warn("[debug] session failed", err);
			}
		}
	} else {
		persistDebugFlag(false);
		discordState.debug = false;
	}

	applyLocale();
	await hydrateFromCloud(store);
	if (!localPlayer) {
		store.commit("cheats/disableCheats");
	}

	new Vue({
		store,
		i18n,
		render: h => h(App),
	}).$mount('#app')

	store.dispatch('chrono/updateOfflineTime');
	store.dispatch('research/startupRoll');
	store.dispatch("cleanup");
	store.dispatch("_resume");
	startCloudAutosave(store);
}

boot();
