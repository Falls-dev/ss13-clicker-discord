import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/GlobalStyle.css';
import '@/assets/DiscordActivity.css';

import store from "@/state/store.js";
import i18n, { setLocale, detectLocale } from "@/i18n";
import { initDiscordActivity, startDebugSession, discordState } from "@/discord/activity";
import { hydrateFromCloud, startCloudAutosave } from "@/cloud/save";
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

async function boot() {
	await initDiscordActivity();

	let serverDebug = false;
	try {
		const cfg = await fetch("/api/config").then(function (r) { return r.json(); });
		serverDebug = !!(cfg && cfg.debug);
	} catch (err) {
		// local serve without API
	}

	const debug = isDebugRequested() || serverDebug;
	if (debug) {
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
	}

	applyLocale();
	await hydrateFromCloud(store);

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
