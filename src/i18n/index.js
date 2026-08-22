import Vue from "vue";
import VueI18n from "vue-i18n";
import { xpFromLevel } from "@/data/experience";
import en from "./en";
import ru from "./ru";
import namesRu from "./names-ru";
import flavorEn from "./flavor-en";
import flavorRu from "./flavor-ru";
import shopDescEn from "./shop-desc-en";
import shopDescRu from "./shop-desc-ru";
import itemDescRu from "./item-desc-ru";

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
		purchases: Object.assign({}, namesRu.items, namesRu.purchases),
		upgrades: namesRu.upgrades,
		actions: namesRu.actions || {},
		itemDesc: itemDescRu
	});
}

export const i18n = new VueI18n({
	locale: detectLocale(),
	fallbackLocale: "en",
	silentTranslationWarn: true,
	messages: {
		en: Object.assign({}, en, { flavor: flavorEn, shopDesc: shopDescEn }),
		ru: mergeNames(Object.assign({}, ru, { flavor: flavorRu, shopDesc: shopDescRu }))
	}
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
		document.title = "Space Clicker 13";
	}
}

function localeHas(vm, key) {
	if (!vm.$i18n || !key) return false;
	const locale = vm.$i18n.locale;
	const messages = vm.$i18n.messages && vm.$i18n.messages[locale];
	if (!messages) return false;
	const parts = String(key).split(".");
	let cur = messages;
	for (let i = 0; i < parts.length; i++) {
		if (!cur || typeof cur !== "object" || !Object.prototype.hasOwnProperty.call(cur, parts[i])) {
			return false;
		}
		cur = cur[parts[i]];
	}
	return typeof cur === "string" || typeof cur === "number";
}

function lookup(vm, prefix, id, fallback) {
	if (!id) return fallback || "";
	const key = prefix + "." + id;
	if (localeHas(vm, key)) {
		const translated = vm.$t(key);
		if (translated && translated !== key) return translated;
	}
	return fallback || id;
}

function optionSlug(name) {
	const slug = String(name || "")
		.replace(/&quot;/g, "")
		.replace(/[^a-zA-Z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
	return slug || "ellipsis";
}

const UPGRADE_NAME_KEYS = {
	inventorySize: "shopDesc.inventoryName",
	miningTools: "shopDesc.upgradeMiningTools",
	xenobiologyPens: "shopDesc.upgradeXenobioPens",
	cableManagement: "shopDesc.upgradeCables",
	fabricationBins: "shopDesc.upgradeMatterBins",
	researchUpgrade: "shopDesc.upgradePointsBank",
	graytidingHacking: "shopDesc.upgradeHacking",
	chemDispenser: "shopDesc.upgradeChem",
	fryCooking: "shopDesc.upgradeCooking",
	tinkeringSpirits: "shopDesc.upgradeTinkering",
	drinkTable: "shopDesc.upgradeBartending",
	antagUpgrade: "shopDesc.upgradeAntag"
};

function jobName(vm, jobId) {
	const key = "jobs." + jobId;
	return localeHas(vm, key) ? vm.$t(key) : jobId;
}

function jobBlitzRange(purchase) {
	if (!purchase || !purchase.upgrade || purchase.upgrade.indexOf("level") !== 0) return null;
	if (purchase.upgrade === "level") return null;
	const jobId = purchase.upgrade.slice(5);
	if (!jobId) return null;
	const req = purchase.requiredUpgrades || {};
	const i = Number(req[purchase.upgrade]);
	if (Number.isNaN(i)) return null;
	const from = Math.max(1, i * 10);
	const to = (i + 1) * 10;
	const xp = xpFromLevel(to) - xpFromLevel(from) + 1;
	return { jobId, from, to, xp };
}

function purchaseDescription(vm, purchaseId, purchase) {
	if (!purchase) return "";
	const t = function (key, values) {
		return vm.$t(key, values);
	};
	const has = function (key) {
		return localeHas(vm, key);
	};

	if (purchase.upgrade === "inventorySize") {
		const from = 10 + ((purchase.requiredUpgrades && purchase.requiredUpgrades.inventorySize) || 0);
		return t("shopDesc.inventorySize", { from: from, to: from + 1 });
	}

	const req = purchase.requiredUpgrades || {};
	const tier = purchase.upgrade != null ? req[purchase.upgrade] : undefined;

	if (purchase.upgrade === "miningTools") {
		if (!tier) return t("shopDesc.speed", { what: t("shopDesc.miningWhat"), percent: 15 });
		return t("shopDesc.speedMore", { what: t("shopDesc.miningWhat"), percent: 15, total: 15 * (tier + 1) });
	}
	if (purchase.upgrade === "cableManagement") {
		if (!tier) return t("shopDesc.speed", { what: t("shopDesc.engineeringWhat"), percent: 15 });
		return t("shopDesc.speedMore", { what: t("shopDesc.engineeringWhat"), percent: 15, total: 15 * (tier + 1) });
	}
	if (purchase.upgrade === "antagUpgrade") {
		if (!tier) return t("shopDesc.speed", { what: t("shopDesc.antagWhat"), percent: 5 });
		return t("shopDesc.speedMore", { what: t("shopDesc.antagWhat"), percent: 5, total: 5 * (tier + 1) });
	}
	if (purchase.upgrade === "fabricationBins") {
		const percent = 100 - 10 * (tier + 1);
		if (!tier) return t("shopDesc.fabrication", { percent: percent });
		return t("shopDesc.fabricationFrom", { percent: percent, from: 100 - 10 * tier });
	}
	if (purchase.upgrade === "researchUpgrade") return t("shopDesc.researchUpgrade");
	if (purchase.upgrade === "graytidingHacking") {
		if (!tier) return t("shopDesc.graytiding", { percent: 6 });
		return t("shopDesc.graytidingMore", { percent: 6, total: 6 * (tier + 1) });
	}
	if (purchase.upgrade === "chemDispenser") {
		if (!tier) return t("shopDesc.chemistry", { percent: 15 });
		return t("shopDesc.chemistryMore", { percent: 15, total: 15 * (tier + 1) });
	}
	if (purchase.upgrade === "fryCooking") {
		if (!tier) return t("shopDesc.cooking", { percent: 15 });
		return t("shopDesc.cookingMore", { percent: 15, total: 15 * (tier + 1) });
	}
	if (purchase.upgrade === "tinkeringSpirits") {
		const cap = 25 * (tier + 1);
		if (!tier) return t("shopDesc.tinkering", { step: 3, cap: cap });
		return t("shopDesc.tinkeringFrom", { step: 3, cap: cap, from: 25 * tier });
	}
	if (purchase.upgrade === "drinkTable") {
		return t("shopDesc.bartending", { step: 4, cap: 5 * (tier + 1) });
	}
	if (purchase.upgrade === "xenobiologyPens") {
		const parts = [];
		for (let j = 0; j <= tier; j++) {
			parts.push(t("shopDesc.xenobioYield", { mult: Math.pow(2, tier - j + 1), tier: j + 1 }));
		}
		return parts.join(", ");
	}

	const blitz = jobBlitzRange(purchase);
	if (blitz) {
		return t("shopDesc.jobBlitz", {
			xp: blitz.xp.toLocaleString(),
			job: jobName(vm, blitz.jobId),
			from: blitz.from,
			to: blitz.to
		});
	}

	if (purchaseId === "seed10") return t("shopDesc.seedPlain");
	if (purchaseId && purchaseId.indexOf("seed") === 0) {
		const discounts = { seed100: 5, seed500: 10, seed2000: 15, seed5000: 20 };
		if (discounts[purchaseId] != null) return t("shopDesc.seedBulk", { discount: discounts[purchaseId] });
	}
	if (purchaseId && purchaseId.indexOf("cape") === 0) {
		if (purchaseId === "capeShitposting") return t("shopDesc.capeShitposting");
		if (purchase.requiredLevels) {
			const jobId = Object.keys(purchase.requiredLevels)[0];
			return t("shopDesc.capeMax", { job: jobName(vm, jobId) });
		}
	}
	if (purchaseId && purchaseId.indexOf("bossTicket") === 0) return t("shopDesc.bossTicket");
	if (purchaseId && purchaseId.indexOf("antagRoll") === 0) return t("shopDesc.antagRoll");

	const idKey = "shopDesc." + purchaseId;
	if (has(idKey)) return t(idKey);

	return purchase.description || "";
}

function purchaseDisplayName(vm, purchaseId, purchase, fallback) {
	if (!purchase) return fallback || "";
	const nameKey = "shopDesc." + purchaseId + "Name";
	if (purchaseId && localeHas(vm, nameKey)) return vm.$t(nameKey);
	if (purchase.upgrade && UPGRADE_NAME_KEYS[purchase.upgrade] && localeHas(vm, UPGRADE_NAME_KEYS[purchase.upgrade])) {
		return vm.$t(UPGRADE_NAME_KEYS[purchase.upgrade]);
	}
	const blitz = jobBlitzRange(purchase);
	if (blitz) {
		return vm.$t("shopDesc.jobBlitzName", {
			job: jobName(vm, blitz.jobId),
			from: blitz.from,
			to: blitz.to
		});
	}
	return fallback || purchase.name || purchaseId;
}

Vue.prototype.$jobName = function (job) {
	if (!job) return "";
	const key = "jobs." + job.id;
	return localeHas(this, key) ? this.$t(key) : job.name || job.id;
};

Vue.prototype.$itemName = function (id, fallback) {
	return lookup(this, "items", id, fallback);
};

Vue.prototype.$itemDesc = function (id, fallback) {
	if (!id) return fallback || "";
	const itemKey = "itemDesc." + id;
	if (localeHas(this, itemKey)) return this.$t(itemKey);
	const shopKey = "shopDesc." + id;
	if (localeHas(this, shopKey)) return this.$t(shopKey);
	return fallback || "";
};

Vue.prototype.$actionLabel = function (actionId, action) {
	if (actionId && localeHas(this, "actions." + actionId)) {
		return this.$t("actions." + actionId);
	}
	if (action && action.item) {
		return this.$itemName(action.item, action.name);
	}
	if (action && action.items && action.items.id) {
		return this.$itemName(action.items.id, action.name);
	}
	if (action && action.itemTables && action.itemTables[0] && action.itemTables[0].item) {
		return this.$itemName(action.itemTables[0].item, action.name);
	}
	if (action && action.name) {
		return this.$itemName(actionId, action.name);
	}
	return (action && action.name) || actionId || "";
};

Vue.prototype.$actionType = function (type) {
	const key = "action.type." + optionSlug(type);
	return localeHas(this, key) ? this.$t(key) : type;
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

Vue.prototype.$purchaseDesc = function (purchaseId, purchase) {
	return purchaseDescription(this, purchaseId, purchase);
};

Vue.prototype.$purchaseDisplayName = function (purchaseId, purchase, fallback) {
	return purchaseDisplayName(this, purchaseId, purchase, fallback);
};

Vue.prototype.$infoOption = function (name) {
	const key = "info.option." + optionSlug(name);
	return localeHas(this, key) ? this.$t(key) : name;
};

Vue.prototype.$equipSlot = function (slot) {
	const key = "equipment." + slot;
	return localeHas(this, key) ? this.$t(key) : slot;
};

Vue.prototype.$actionVerb = function (raw) {
	if (!raw) return "";
	const key = "action.verb." + optionSlug(raw);
	return localeHas(this, key) ? this.$t(key) : raw;
};

setLocale(i18n.locale);

export default i18n;
