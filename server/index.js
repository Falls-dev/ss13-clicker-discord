const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const PORT = Number(process.env.PORT || 4443);
const HOST = process.env.HOST || "127.0.0.1";
const CLIENT_ID = String(
	process.env.DISCORD_CLIENT_ID || process.env.VUE_APP_DISCORD_CLIENT_ID || ""
).trim();
const CLIENT_SECRET = String(process.env.DISCORD_CLIENT_SECRET || "").trim();
const LOCAL_PLAYER = String(process.env.LOCAL_PLAYER || "") === "1";
const DEBUG_REQUESTED = String(process.env.DEBUG || "") === "1";
const DEBUG = DEBUG_REQUESTED && LOCAL_PLAYER;
const BEHIND_PROXY = String(process.env.BEHIND_PROXY || "1") !== "0";
const DIST_PATH = path.join(__dirname, "..", "dist");

function firstExistingFile(candidates) {
	for (let i = 0; i < candidates.length; i++) {
		const filePath = candidates[i];
		if (filePath && fs.existsSync(filePath)) return filePath;
	}
	return null;
}

function resolveTls() {
	if (BEHIND_PROXY) return null;
	const cert = firstExistingFile([
		process.env.TLS_CERT,
		path.join(__dirname, "..", "certs", "fullchain.pem"),
		path.join(__dirname, "..", "certs", "cert.pem")
	]);
	const key = firstExistingFile([
		process.env.TLS_KEY,
		path.join(__dirname, "..", "certs", "privkey.pem"),
		path.join(__dirname, "..", "certs", "key.pem")
	]);
	if (cert && key) {
		return {
			cert: fs.readFileSync(cert),
			key: fs.readFileSync(key)
		};
	}
	return null;
}

function bearerToken(req) {
	const header = req.headers.authorization || "";
	if (header.indexOf("Bearer ") === 0) return header.slice(7).trim();
	if (req.body && req.body.session_token) return req.body.session_token;
	if (req.query && req.query.session_token) return req.query.session_token;
	return "";
}

function requireSession(req, res, next) {
	const session = db.getSession(bearerToken(req));
	if (!session) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	req.session = session;
	next();
}

function isAllowedOrigin(origin) {
	if (!origin) return false;
	try {
		const host = new URL(origin).hostname;
		if (host === "spacestation13clicker.ss13.site") return true;
		if (/\.discordsays\.com$/i.test(host)) return true;
		if (/\.discordactivities\.com$/i.test(host)) return true;
		if (host === "discord.com" || /\.discord\.com$/i.test(host)) return true;
		if (LOCAL_PLAYER && (host === "localhost" || host === "127.0.0.1")) return true;
	} catch (err) {
		return false;
	}
	return false;
}

const CLEAN_CHEATS = {
	showAllActions: false,
	unlockAllJobs: false,
	cheatsEnabled: false,
	infiniteChrono: false,
	extraChronoOptions: false
};

function sanitizeSave(save) {
	if (!save || typeof save !== "object" || Array.isArray(save)) return null;
	let cloned;
	try {
		cloned = JSON.parse(JSON.stringify(save));
	} catch (err) {
		return null;
	}
	delete cloned.__proto__;
	delete cloned.constructor;
	if (!DEBUG) {
		cloned.cheats = Object.assign({}, CLEAN_CHEATS);
	}
	return cloned;
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	const origin = req.headers.origin;
	if (origin && isAllowedOrigin(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		res.setHeader("Vary", "Origin");
	}
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader(
		"Content-Security-Policy",
		"frame-ancestors https://discord.com https://*.discord.com https://*.discordapp.net https://*.discordsays.com"
	);
	res.removeHeader("X-Frame-Options");
	if (req.method === "OPTIONS") return res.sendStatus(204);
	next();
});

function sendConfig(_req, res) {
	const cfg = {
		clientId: CLIENT_ID,
		activity: true,
		localPlayer: LOCAL_PLAYER
	};
	if (DEBUG) cfg.debug = true;
	res.json(cfg);
}

async function parseDiscordJson(response) {
	const text = await response.text();
	try {
		return JSON.parse(text);
	} catch (err) {
		return {
			error: "non_json",
			error_description: String(text || "").slice(0, 180)
		};
	}
}

async function exchangeToken(req, res) {
	console.warn("[auth] /api/token hit", {
		path: req.path,
		origin: req.headers.origin || "",
		contentType: req.headers["content-type"] || "",
		hasBody: Boolean(req.body),
		bodyKeys: req.body ? Object.keys(req.body) : []
	});
	if (!CLIENT_ID || !CLIENT_SECRET) {
		console.warn("[auth] missing CLIENT_ID or CLIENT_SECRET", {
			clientIdLen: CLIENT_ID.length,
			secretLen: CLIENT_SECRET.length
		});
		return res.status(500).json({
			error: "Server is missing DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET"
		});
	}
	const code = req.body && (req.body.code || req.body.Code);
	if (!code) {
		console.warn("[auth] missing oauth code", { bodyType: typeof req.body });
		return res.status(400).json({ error: "Missing OAuth code" });
	}
	const requestedRedirect = req.body && req.body.redirect_uri;
	console.warn("[auth] exchanging code", {
		codeLen: String(code).length,
		codePrefix: String(code).slice(0, 4),
		requestedRedirect: requestedRedirect || ""
	});

	try {
		async function requestDiscordToken(extra) {
			const params = Object.assign({
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				grant_type: "authorization_code",
				code: String(code)
			}, extra || {});
			const response = await fetch("https://discord.com/api/oauth2/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"User-Agent": "DiscordBot (https://spacestation13clicker.ss13.site, 1.4.3)"
				},
				body: new URLSearchParams(params)
			});
			const payload = await parseDiscordJson(response);
			return { response: response, payload: payload };
		}

		// Activity OAuth codes are bound to the portal placeholder https://127.0.0.1.
		// A mismatch often comes back as invalid_grant; keep trying other redirect_uri
		// values because Discord does not always consume the code on redirect errors.
		const redirectTries = [];
		function addRedirectTry(uri) {
			if (uri && redirectTries.some(function (item) { return item.redirect_uri === uri; })) return;
			if (uri) redirectTries.push({ redirect_uri: uri });
		}
		addRedirectTry(requestedRedirect && String(requestedRedirect));
		addRedirectTry("https://127.0.0.1");
		addRedirectTry("http://127.0.0.1/callback");
		addRedirectTry("http://127.0.0.1");
		addRedirectTry("https://" + CLIENT_ID + ".discordsays.com");
		redirectTries.push({});
		let exchanged = { response: { ok: false, status: 0 }, payload: {} };
		let usedTry = -1;
		for (let i = 0; i < redirectTries.length; i++) {
			exchanged = await requestDiscordToken(redirectTries[i]);
			console.warn("[auth] token try", {
				i: i,
				redirect: redirectTries[i].redirect_uri || "(none)",
				status: exchanged.response.status,
				error: exchanged.payload && exchanged.payload.error,
				error_description: exchanged.payload && exchanged.payload.error_description
			});
			if (exchanged.response.ok && exchanged.payload && exchanged.payload.access_token) {
				usedTry = i;
				break;
			}
		}
		const payload = exchanged.payload;
		if (!exchanged.response.ok || !payload.access_token) {
			console.warn("[auth] Discord token exchange failed", {
				status: exchanged.response.status,
				error: payload && payload.error,
				error_description: payload && payload.error_description
			});
			return res.status(502).json({
				error: "Discord token exchange failed"
			});
		}

		const meResponse = await fetch("https://discord.com/api/users/@me", {
			headers: {
				Authorization: "Bearer " + payload.access_token,
				"User-Agent": "DiscordBot (https://spacestation13clicker.ss13.site, 1.4.3)"
			}
		});
		const user = await parseDiscordJson(meResponse);
		if (!meResponse.ok || !user.id) {
			console.warn("[ss13-idle] /users/@me failed", meResponse.status, user && user.message);
			return res.status(502).json({ error: "Failed to fetch Discord user" });
		}

		const session_token = db.createSession(user);
		console.warn("[auth] token exchange ok", {
			userId: user.id,
			username: user.username,
			usedTry: usedTry
		});
		return res.json({
			access_token: payload.access_token,
			session_token,
			user: {
				id: user.id,
				username: user.username,
				global_name: user.global_name,
				locale: user.locale
			}
		});
	} catch (err) {
		console.warn("[auth] Discord token exchange exception", err && err.message, err && err.stack);
		return res.status(502).json({ error: "Discord token exchange failed" });
	}
}

app.get("/api/health", function (_req, res) {
	res.json({ ok: true });
});
app.get("/api/config", sendConfig);
app.get("/.proxy/api/config", sendConfig);
app.post("/api/token", exchangeToken);
app.post("/.proxy/api/token", exchangeToken);

function getSave(req, res) {
	const current = db.getSave(req.session.userId);
	if (!current) {
		return res.json({ save: null, updatedAt: 0, revision: 0 });
	}
	current.save = sanitizeSave(current.save) || current.save;
	return res.json(current);
}

function postSave(req, res) {
	const save = sanitizeSave(req.body && req.body.save);
	if (!save) {
		return res.status(400).json({ error: "Missing save payload" });
	}
	const result = db.putSave(
		req.session.userId,
		save,
		req.body.updatedAt
	);
	if (result.conflict) {
		return res.status(409).json({
			error: "Newer save exists",
			...result.current
		});
	}
	return res.json({
		ok: true,
		updatedAt: result.updatedAt,
		revision: result.revision
	});
}

function sendMe(req, res) {
	res.json({
		id: req.session.userId,
		username: req.session.username,
		global_name: req.session.username,
		locale: req.session.locale
	});
}

app.get("/api/me", requireSession, sendMe);
app.get("/.proxy/api/me", requireSession, sendMe);
app.get("/api/save", requireSession, getSave);
app.get("/.proxy/api/save", requireSession, getSave);
app.post("/api/save", requireSession, postSave);
app.post("/.proxy/api/save", requireSession, postSave);

function debugSession(_req, res) {
	if (!LOCAL_PLAYER || !DEBUG) {
		return res.status(404).json({ error: "Not found" });
	}
	const session_token = db.createSession({
		id: "debug-local",
		username: "debug",
		locale: "en"
	});
	return res.json({
		session_token,
		user: { id: "debug-local", username: "debug", global_name: "Debug" }
	});
}

if (DEBUG) {
	app.post("/api/debug/session", debugSession);
	app.post("/.proxy/api/debug/session", debugSession);
}

if (!fs.existsSync(path.join(DIST_PATH, "index.html"))) {
	console.warn("[discord] dist/ is missing. Run `npm run build` before `npm start`.");
}

app.use(express.static(DIST_PATH));
app.use(function (req, res, next) {
	if (req.method !== "GET" && req.method !== "HEAD") return next();
	if (req.path.indexOf("/api") === 0 || req.path.indexOf("/.proxy/api") === 0) {
		return res.status(404).json({ error: "Not found" });
	}
	res.sendFile(path.join(DIST_PATH, "index.html"));
});

const tls = resolveTls();
const server = tls ? https.createServer(tls, app) : http.createServer(app);
const protocol = tls ? "https" : "http";

server.listen(PORT, HOST, function () {
	console.log("[ss13-idle] listening on " + protocol + "://" + HOST + ":" + PORT);
	console.log("[ss13-idle] public URL: https://spacestation13clicker.ss13.site");
	console.log("[ss13-idle] sqlite: " + db.DB_PATH);
	if (DEBUG) console.log("[ss13-idle] DEBUG mode enabled (LOCAL_PLAYER=1)");
	else if (DEBUG_REQUESTED && !LOCAL_PLAYER) {
		console.warn("[ss13-idle] DEBUG ignored because LOCAL_PLAYER is off");
	}
	console.log("[ss13-idle] LOCAL_PLAYER=" + (LOCAL_PLAYER ? "1 (browser allowed)" : "0 (Discord only)"));
	console.warn("[auth] env", {
		clientIdLen: CLIENT_ID.length,
		secretLen: CLIENT_SECRET.length,
		behindProxy: BEHIND_PROXY
	});
	if (!CLIENT_ID || !CLIENT_SECRET) {
		console.warn("[ss13-idle] Set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in .env");
	}
});
