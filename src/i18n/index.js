import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./en";
import ru from "./ru";

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

export const i18n = new VueI18n({
	locale: detectLocale(),
	fallbackLocale: "en",
	silentTranslationWarn: true,
	messages: { en, ru }
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

Vue.prototype.$jobName = function (job) {
	if (!job) return "";
	const key = "jobs." + job.id;
	return this.$te(key) ? this.$t(key) : job.name || job.id;
};

setLocale(i18n.locale);

export default i18n;
