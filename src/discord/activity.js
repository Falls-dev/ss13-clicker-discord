import Vue from "vue";

export const LAYOUT_FOCUSED = 0;
export const LAYOUT_PIP = 1;
export const LAYOUT_GRID = 2;

export const discordState = Vue.observable({
	active: false,
	ready: false,
	user: null,
	sessionToken: "",
	layoutMode: LAYOUT_FOCUSED,
	debug: false,
	localPlayer: false
});

let discordSdk = null;

export function isDiscordActivity() {
	if (typeof window === "undefined") return false;
	const host = window.location.hostname || "";
	const params = new URLSearchParams(window.location.search);
	return (
		Boolean(params.get("frame_id") || params.get("instance_id")) ||
		/\.discordsays\.com$/i.test(host) ||
		/\.discordactivities\.com$/i.test(host)
	);
}

export function getDiscordSdk() {
	return discordSdk;
}

function applyDiscordClass() {
	if (typeof document === "undefined") return;
	document.documentElement.classList.add("discord-activity");
	if (document.body) document.body.classList.add("discord-activity");
}

if (typeof document !== "undefined" && isDiscordActivity()) {
	applyDiscordClass();
	discordState.active = true;
}

async function discordFetch(path, options) {
	const opts = Object.assign({}, options || {});
	opts.headers = Object.assign({}, opts.headers || {});
	if (discordState.sessionToken && !opts.headers.Authorization) {
		opts.headers.Authorization = "Bearer " + discordState.sessionToken;
	}
	const urls = [path];
	if (path.indexOf("/.proxy/") !== 0) {
		urls.push("/.proxy" + path);
	}
	let lastError = null;
	for (let i = 0; i < urls.length; i++) {
		try {
			const response = await fetch(urls[i], opts);
			if (response.ok || response.status === 409) return response;
			lastError = new Error(path + " -> " + response.status);
		} catch (err) {
			lastError = err;
		}
	}
	throw lastError || new Error("Request failed: " + path);
}

export function apiFetch(path, options) {
	return discordFetch(path, options);
}

export function getSessionToken() {
	return discordState.sessionToken || "";
}

async function resolveClientId() {
	try {
		const response = await discordFetch("/api/config");
		const data = await response.json();
		if (data && data.clientId) return String(data.clientId);
	} catch (err) {
		// Standalone / local serve has no Express API.
	}
	return process.env.VUE_APP_DISCORD_CLIENT_ID || "";
}

async function loadEmbeddedAppSdk() {
	if (typeof window === "undefined") return null;
	if (window.DiscordEmbeddedAppSdk) return window.DiscordEmbeddedAppSdk;

	await new Promise(function (resolve, reject) {
		const script = document.createElement("script");
		const base = process.env.BASE_URL || "/";
		script.src = base + "discord-sdk.js";
		script.async = true;
		script.onload = resolve;
		script.onerror = function () {
			reject(new Error("Failed to load discord-sdk.js"));
		};
		document.head.appendChild(script);
	});

	return window.DiscordEmbeddedAppSdk || null;
}

export async function initDiscordActivity() {
	if (!isDiscordActivity()) return null;

	applyDiscordClass();
	discordState.active = true;

	const clientId = await resolveClientId();
	if (!clientId) {
		console.warn("[discord] Missing client id. Set DISCORD_CLIENT_ID on the server.");
		return null;
	}

	let DiscordSDK;
	let Common;
	let Events;
	try {
		const sdk = await loadEmbeddedAppSdk();
		if (!sdk || !sdk.DiscordSDK) {
			throw new Error("DiscordEmbeddedAppSdk.DiscordSDK is missing");
		}
		DiscordSDK = sdk.DiscordSDK;
		Common = sdk.Common;
		Events = sdk.Events;
	} catch (err) {
		console.warn("[discord] Failed to load Embedded App SDK", err);
		return null;
	}

	discordSdk = new DiscordSDK(clientId);

	try {
		await discordSdk.ready();
		discordState.ready = true;
	} catch (err) {
		console.warn("[discord] SDK ready() failed", err);
		return discordSdk;
	}

	try {
		await discordSdk.commands.setOrientationLockState({
			lock_state: Common.OrientationLockStateTypeObject.LANDSCAPE,
			picture_in_picture_lock_state: Common.OrientationLockStateTypeObject.LANDSCAPE,
			grid_lock_state: Common.OrientationLockStateTypeObject.LANDSCAPE
		});
	} catch (err) {
		// Orientation lock is best-effort; desktop Discord may ignore it.
	}

	try {
		await discordSdk.subscribe(Events.ACTIVITY_LAYOUT_MODE_UPDATE, event => {
			if (event && typeof event.layout_mode === "number") {
				discordState.layoutMode = event.layout_mode;
			}
		});
	} catch (err) {
		console.warn("[discord] layout subscribe failed", err);
	}

	try {
		const auth = await authenticateUser(clientId);
		if (auth && auth.user) {
			discordState.user = auth.user;
		}
	} catch (err) {
		console.warn("[discord] OAuth failed, continuing as guest", err);
	}

	return discordSdk;
}

async function authenticateUser(clientId) {
	const { code } = await discordSdk.commands.authorize({
		client_id: clientId,
		response_type: "code",
		state: "",
		prompt: "none",
		scope: ["identify"]
	});

	const tokenResponse = await discordFetch("/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code })
	});
	const payload = await tokenResponse.json();
	if (!payload || !payload.access_token) {
		throw new Error("Token exchange returned no access_token");
	}
	if (payload.session_token) {
		discordState.sessionToken = payload.session_token;
	}
	if (payload.user) {
		discordState.user = payload.user;
	}

	return discordSdk.commands.authenticate({
		access_token: payload.access_token
	});
}

export async function startDebugSession(userId) {
	const response = await discordFetch("/api/debug/session", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userId: userId || "debug-local" })
	});
	const payload = await response.json();
	if (payload.session_token) {
		discordState.sessionToken = payload.session_token;
		discordState.user = payload.user || { id: userId || "debug-local", username: "debug" };
		discordState.debug = true;
	}
	return payload;
}

export async function openExternalLink(url) {
	if (discordSdk && discordSdk.commands && discordSdk.commands.openExternalLink) {
		try {
			await discordSdk.commands.openExternalLink({ url });
			return;
		} catch (err) {
			// Fall through to window.open
		}
	}
	window.open(url, "_blank", "noopener");
}
