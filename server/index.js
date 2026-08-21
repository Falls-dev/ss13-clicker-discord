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
const CLIENT_ID =
	process.env.DISCORD_CLIENT_ID || process.env.VUE_APP_DISCORD_CLIENT_ID || "";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
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

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "8mb" }));

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
	res.setHeader(
		"Content-Security-Policy",
		"frame-ancestors https://discord.com https://*.discord.com https://*.discordapp.net https://*.discordsays.com"
	);
	res.removeHeader("X-Frame-Options");
	if (req.method === "OPTIONS") return res.sendStatus(204);
	next();
});

function sendConfig(_req, res) {
	res.json({
		clientId: CLIENT_ID,
		activity: true,
		localPlayer: LOCAL_PLAYER,
		debug: DEBUG
	});
}

async function exchangeToken(req, res) {
	if (!CLIENT_ID || !CLIENT_SECRET) {
		return res.status(500).json({
			error: "Server is missing DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET"
		});
	}
	if (!req.body || !req.body.code) {
		return res.status(400).json({ error: "Missing OAuth code" });
	}

	try {
		const response = await fetch("https://discord.com/api/oauth2/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				grant_type: "authorization_code",
				code: req.body.code
			})
		});
		const payload = await response.json();
		if (!response.ok || !payload.access_token) {
			return res.status(502).json({
				error: "Discord token exchange failed",
				details: payload
			});
		}

		const meResponse = await fetch("https://discord.com/api/users/@me", {
			headers: { Authorization: "Bearer " + payload.access_token }
		});
		const user = await meResponse.json();
		if (!meResponse.ok || !user.id) {
			return res.status(502).json({ error: "Failed to fetch Discord user" });
		}

		const session_token = db.createSession(user);
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
		return res.status(502).json({ error: "Discord token exchange failed" });
	}
}

app.get("/api/health", function (_req, res) {
	res.json({ ok: true, debug: DEBUG, localPlayer: LOCAL_PLAYER, db: db.stats() });
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
	return res.json(current);
}

function postSave(req, res) {
	if (!req.body || typeof req.body.save !== "object") {
		return res.status(400).json({ error: "Missing save payload" });
	}
	const result = db.putSave(
		req.session.userId,
		req.body.save,
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

app.get("/api/save", requireSession, getSave);
app.get("/.proxy/api/save", requireSession, getSave);
app.post("/api/save", requireSession, postSave);
app.post("/.proxy/api/save", requireSession, postSave);

function debugSession(req, res) {
	if (!LOCAL_PLAYER || !DEBUG) {
		return res.status(403).json({ error: "Debug is disabled" });
	}
	const userId = (req.body && req.body.userId) || "debug-local";
	const session_token = db.createSession({
		id: String(userId),
		username: "debug",
		locale: "en"
	});
	return res.json({
		session_token,
		user: { id: String(userId), username: "debug", global_name: "Debug" }
	});
}

app.post("/api/debug/session", debugSession);
app.post("/.proxy/api/debug/session", debugSession);

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
	if (!CLIENT_ID || !CLIENT_SECRET) {
		console.warn("[ss13-idle] Set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in .env");
	}
});
