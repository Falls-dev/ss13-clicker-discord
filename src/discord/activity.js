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
	localPlayer: false,
	authError: "",
	authLog: []
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

function sanitizeAuthData(data) {
	if (!data || typeof data !== "object") return data;
	const out = {};
	Object.keys(data).forEach(function (key) {
		const val = data[key];
		if (val == null) {
			out[key] = val;
			return;
		}
		if (key === "code" || key === "access_token" || key === "session_token") {
			const str = String(val);
			out[key + "Len"] = str.length;
			out[key + "Prefix"] = str.slice(0, 4);
			return;
		}
		if (typeof val === "string" && val.length > 240) {
			out[key] = val.slice(0, 240) + "…";
			return;
		}
		out[key] = val;
	});
	return out;
}

export function authLog(msg, data) {
	const line = {
		t: new Date().toISOString(),
		msg: String(msg || ""),
		data: sanitizeAuthData(data)
	};
	discordState.authLog.push(line);
	if (discordState.authLog.length > 50) discordState.authLog.shift();
	console.warn("[auth]", line.t, line.msg, line.data || "");
	if (typeof fetch !== "function") return;
	const body = JSON.stringify(line);
	const urls = isDiscordActivity()
		? ["/.proxy/api/auth-log", "https://spacestation13clicker.ss13.site/api/auth-log"]
		: ["/api/auth-log"];
	urls.forEach(function (url) {
		fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: body
		}).catch(function () {});
	});
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
	const method = String(opts.method || "GET").toUpperCase();
	const isWrite = method !== "GET" && method !== "HEAD";
	const urls = [];
	if (isDiscordActivity()) {
		if (path.indexOf("/.proxy/") === 0) {
			urls.push(path);
		} else {
			urls.push("/.proxy" + path);
			if (!isWrite) urls.push(path);
			if (isWrite && path.indexOf("/api/token") === 0) {
				urls.push("https://spacestation13clicker.ss13.site" + path);
			}
		}
	} else {
		urls.push(path);
	}
	const logThis =
		path.indexOf("/api/token") === 0 ||
		path.indexOf("/api/config") === 0 ||
		path.indexOf("/api/me") === 0;
	let lastError = null;
	for (let i = 0; i < urls.length; i++) {
		try {
			if (logThis) authLog("fetch try", { path: path, url: urls[i], method: method });
			const response = await fetch(urls[i], opts);
			if (logThis) {
				authLog("fetch status", {
					path: path,
					url: urls[i],
					status: response.status,
					ok: response.ok
				});
			}
			if (response.ok || response.status === 409) return response;
			let snippet = "";
			try {
				snippet = (await response.clone().text()).slice(0, 200);
			} catch (readErr) {
				snippet = "";
			}
			lastError = new Error(path + " -> " + response.status + (snippet ? " " + snippet : ""));
			if (logThis) authLog("fetch fail body", { path: path, status: response.status, snippet: snippet });
			if (isWrite && response.status !== 404 && response.status !== 405) break;
		} catch (err) {
			if (logThis) {
				authLog("fetch error", {
					path: path,
					url: urls[i],
					error: err && err.message
				});
			}
			lastError = err;
			if (isWrite && urls.length === i + 1) break;
			if (isWrite && path.indexOf("/api/token") !== 0) break;
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

const SESSION_STORAGE_KEY = "space-clicker-13-session";

function normalizeUser(user) {
	if (!user) return null;
	const id = user.id || user.userId;
	if (!id) return null;
	return {
		id: String(id),
		username: user.username || "",
		global_name: user.global_name || user.globalName || user.display_name || "",
		locale: user.locale || ""
	};
}

function persistSession() {
	if (typeof window === "undefined") return;
	const payload = JSON.stringify({
		sessionToken: discordState.sessionToken || "",
		user: discordState.user
	});
	try {
		window.localStorage.setItem(SESSION_STORAGE_KEY, payload);
	} catch (err) {
		// ignore
	}
	try {
		window.sessionStorage.setItem(SESSION_STORAGE_KEY, payload);
	} catch (err) {
		// ignore
	}
}

function restoreSession() {
	if (typeof window === "undefined") return;
	const stores = [window.localStorage, window.sessionStorage];
	for (let i = 0; i < stores.length; i++) {
		try {
			const raw = stores[i].getItem(SESSION_STORAGE_KEY);
			if (!raw) continue;
			const data = JSON.parse(raw);
			if (data.sessionToken) discordState.sessionToken = data.sessionToken;
			const user = normalizeUser(data.user);
			if (user) discordState.user = user;
			if (discordState.sessionToken) return;
		} catch (err) {
			// ignore
		}
	}
}

function clearSession() {
	discordState.sessionToken = "";
	discordState.user = null;
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(SESSION_STORAGE_KEY);
	} catch (err) {
		// ignore
	}
	try {
		window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
	} catch (err) {
		// ignore
	}
}

function setDiscordUser(user) {
	const next = normalizeUser(user);
	if (!next) return;
	discordState.user = next;
	persistSession();
}

export async function fetchSessionUser() {
	if (!discordState.sessionToken) return null;
	try {
		const response = await discordFetch("/api/me");
		const payload = await response.json();
		if (payload && payload.id) {
			setDiscordUser(payload);
			return payload;
		}
	} catch (err) {
		// Session expired or the API is unreachable.
	}
	return discordState.user;
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
	if (!isDiscordActivity()) {
		authLog("skip init: not discord activity", {
			host: typeof window !== "undefined" ? window.location.hostname : "",
			search: typeof window !== "undefined" ? window.location.search : ""
		});
		return null;
	}

	applyDiscordClass();
	discordState.active = true;
	restoreSession();
	authLog("init start", {
		host: window.location.hostname,
		href: window.location.href.slice(0, 180),
		hasSession: Boolean(discordState.sessionToken),
		userId: discordState.user && discordState.user.id
	});

	const clientId = await resolveClientId();
	authLog("client id", { clientId: clientId, len: (clientId || "").length });
	if (!clientId) {
		authLog("missing client id");
		console.warn("[discord] Missing client id. Set DISCORD_CLIENT_ID on the server.");
		return null;
	}

	let DiscordSDK;
	let Common;
	let Events;
	try {
		const sdk = await loadEmbeddedAppSdk();
		authLog("sdk loaded", {
			hasSdk: Boolean(sdk),
			keys: sdk ? Object.keys(sdk).slice(0, 12).join(",") : ""
		});
		if (!sdk || !sdk.DiscordSDK) {
			throw new Error("DiscordEmbeddedAppSdk.DiscordSDK is missing");
		}
		DiscordSDK = sdk.DiscordSDK;
		Common = sdk.Common;
		Events = sdk.Events;
	} catch (err) {
		authLog("sdk load failed", { error: err && err.message });
		console.warn("[discord] Failed to load Embedded App SDK", err);
		return null;
	}

	discordSdk = new DiscordSDK(clientId);
	authLog("sdk constructed");

	try {
		await discordSdk.ready();
		discordState.ready = true;
		authLog("sdk ready");
	} catch (err) {
		authLog("sdk ready failed", { error: err && err.message });
		console.warn("[discord] SDK ready() failed", err);
		return discordSdk;
	}

	try {
		await authenticateUser(clientId);
		discordState.authError = "";
		authLog("authenticateUser ok", {
			hasSession: Boolean(discordState.sessionToken),
			userId: discordState.user && discordState.user.id
		});
	} catch (err) {
		discordState.authError = (err && err.message) || "oauth-failed";
		authLog("authenticateUser failed", { error: err && err.message });
		console.warn("[discord] OAuth failed, continuing with saved session if any", err);
	}

	if (discordState.sessionToken) {
		await fetchSessionUser();
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

	return discordSdk;
}

let authInFlight = null;

// Activity token exchange uses the portal placeholder. RPC authorize itself
// must not send https://127.0.0.1 — Discord rejects it with
// "Redirect URI cannot be used in the RPC OAuth2 Authorization flow".
const ACTIVITY_REDIRECT_URI = "https://127.0.0.1";
const RPC_REDIRECT_URIS = ["http://127.0.0.1/callback", "http://127.0.0.1"];

function errorText(err) {
	if (!err) return "";
	if (typeof err === "string") return err;
	if (err.message) return String(err.message);
	try {
		return JSON.stringify(err);
	} catch (jsonErr) {
		return String(err);
	}
}

function isRedirectAuthorizeError(err) {
	const msg = errorText(err);
	return /redirect_uri/i.test(msg) || /RPC OAuth2/i.test(msg);
}

async function authorizeOnce(clientId, redirectUri) {
	const args = {
		client_id: clientId,
		response_type: "code",
		state: "",
		prompt: "none",
		scope: ["identify"]
	};
	if (redirectUri) args.redirect_uri = redirectUri;
	authLog("authorize try", { redirectUri: redirectUri || "(omit)" });
	const result = await discordSdk.commands.authorize(args);
	authLog("authorize result", {
		hasCode: Boolean(result && result.code),
		keys: result ? Object.keys(result).join(",") : "",
		redirectUri: redirectUri || "(omit)",
		code: result && result.code
	});
	if (!result || !result.code) {
		throw new Error("Discord authorize returned no code");
	}
	return {
		code: result.code,
		redirectUri: redirectUri || ACTIVITY_REDIRECT_URI
	};
}

async function authorizeCode(clientId) {
	authLog("authorize start", { clientIdLen: (clientId || "").length });
	try {
		return await authorizeOnce(clientId, null);
	} catch (err) {
		authLog("authorize default failed", { error: errorText(err) });
		if (!isRedirectAuthorizeError(err)) throw err;
	}

	let lastError = null;
	for (let i = 0; i < RPC_REDIRECT_URIS.length; i++) {
		try {
			return await authorizeOnce(clientId, RPC_REDIRECT_URIS[i]);
		} catch (err) {
			lastError = err;
			authLog("authorize rpc uri failed", {
				redirectUri: RPC_REDIRECT_URIS[i],
				error: errorText(err)
			});
		}
	}
	throw lastError || new Error("Discord authorize returned no code");
}

async function authenticateUser(clientId) {
	if (authInFlight) return authInFlight;
	authInFlight = authenticateUserOnce(clientId).finally(function () {
		authInFlight = null;
	});
	return authInFlight;
}

async function authenticateUserOnce(clientId) {
	if (discordState.sessionToken) {
		authLog("trying existing session");
		const existing = await fetchSessionUser();
		if (existing && existing.id) {
			discordState.authError = "";
			authLog("existing session ok", { userId: existing.id });
			return existing;
		}
		authLog("existing session invalid, clearing");
		clearSession();
	}

	const authorized = await authorizeCode(clientId);
	authLog("posting /api/token", {
		code: authorized.code,
		redirect_uri: authorized.redirectUri
	});

	const tokenResponse = await discordFetch("/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			code: authorized.code,
			redirect_uri: authorized.redirectUri
		})
	});
	const payload = await tokenResponse.json();
	authLog("token payload", {
		keys: payload ? Object.keys(payload).join(",") : "",
		error: payload && payload.error,
		hasAccess: Boolean(payload && payload.access_token),
		hasSession: Boolean(payload && payload.session_token),
		access_token: payload && payload.access_token,
		session_token: payload && payload.session_token
	});
	if (!payload || !payload.access_token || !payload.session_token) {
		throw new Error((payload && payload.error) || "Token exchange returned no access_token");
	}
	discordState.sessionToken = payload.session_token;
	discordState.authError = "";
	persistSession();
	if (payload.user) {
		setDiscordUser(payload.user);
	}

	try {
		authLog("sdk authenticate start");
		const auth = await discordSdk.commands.authenticate({
			access_token: payload.access_token
		});
		authLog("sdk authenticate ok", { userId: auth && auth.user && auth.user.id });
		if (auth && auth.user) {
			setDiscordUser(Object.assign({}, payload.user || {}, auth.user));
		}
		return auth;
	} catch (err) {
		authLog("sdk authenticate failed, using server session", { error: err && err.message });
		console.warn("[discord] SDK authenticate() failed; using server session", err);
		return payload;
	}
}

export async function retryDiscordLogin() {
	if (!discordSdk) return null;
	const clientId = await resolveClientId();
	if (!clientId) throw new Error("Missing Discord client id");
	clearSession();
	return authenticateUser(clientId);
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
