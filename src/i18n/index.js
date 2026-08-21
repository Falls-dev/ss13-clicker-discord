import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./en";
import ru from "./ru";
import namesRu from "./names-ru";

Vue.use(VueI18n);

const STORAGE_KEY = "ss13-idle-locale";

export function detectLocale() {
	try {
		const saved = window.localStorage.getItem(STORAGE_KEY);
		if (saved === "ru" || saved === "en") return saved;
	} catch (err) {
		// ignore
	}
	const lang = (typeof navigator !== "undefined" && (navigator.language || "")).toLowerCase();
	if (lang.indexOf("ru") === 0) return "ru";
	return "en";
}

function mergeNames(messages) {
	return Object.assign({}, messages, {
		items: namesRu.items,
		enemies: namesRu.enemies,
		zones: namesRu.zones,
		purchases: namesRu.purchases,
		upgrades: namesRu.upgrades
	});
}

export const i18n = new VueI18n({
	locale: detectLocale(),
	fallbackLocale: "en",
	silentTranslationWarn: true,
	messages: { en, ru: mergeNames(ru) }
});

export function setLocale(locale) {
	const next = locale === "ru" ? "ru" : "en";
	i18n.locale = next;
	try {
		window.localStorage.setItem(STORAGE_KEY, next);
	} catch (err) {
		// ignore
	}
	if (typeof document !== "undefined") {
		document.documentElement.lang = next;
	}
}

function lookup(vm, prefix, id, fallback) {
	if (!id) return fallback || "";
	const key = prefix + "." + id;
	if (vm.$i18n && vm.$i18n.locale === "ru" && vm.$te(key)) {
		const translated = vm.$t(key);
		if (translated && translated !== key) return translated;
	}
	return fallback || id;
}

function optionSlug(name) {
	return String(name || "")
		.replace(/&quot;/g, "")
		.replace(/[^a-zA-Z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
}

Vue.prototype.$jobName = function (job) {
	if (!job) return "";
	const key = "jobs." + job.id;
	return this.$te(key) ? this.$t(key) : job.name || job.id;
};

Vue.prototype.$itemName = function (id, fallback) {
	return lookup(this, "items", id, fallback);
};

Vue.prototype.$enemyName = function (id, fallback) {
	return lookup(this, "enemies", id, fallback);
};

Vue.prototype.$zoneName = function (zone) {
	if (!zone) return "";
	return lookup(this, "zones", zone.name, zone.name);
};

Vue.prototype.$purchaseName = function (id, fallback) {
	return lookup(this, "purchases", id, fallback);
};

Vue.prototype.$upgradeName = function (id, fallback) {
	return lookup(this, "upgrades", id, fallback);
};

Vue.prototype.$infoOption = function (name) {
	const key = "info.option." + optionSlug(name);
	return this.$te(key) ? this.$t(key) : name;
};

Vue.prototype.$equipSlot = function (slot) {
	const key = "equipment." + slot;
	return this.$te(key) ? this.$t(key) : slot;
};

setLocale(i18n.locale);

export default i18n;
