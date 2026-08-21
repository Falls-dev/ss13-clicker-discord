const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const PORT = Number(process.env.PORT || 4443);
const HOST = process.env.HOST || "0.0.0.0";
const CLIENT_ID =
	process.env.DISCORD_CLIENT_ID || process.env.VUE_APP_DISCORD_CLIENT_ID || "";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const DIST_PATH = path.join(__dirname, "..", "dist");

function firstExistingFile(candidates) {
	for (let i = 0; i < candidates.length; i++) {
		const filePath = candidates[i];
		if (filePath && fs.existsSync(filePath)) return filePath;
	}
	return null;
}

function resolveTls() {
	const cert = firstExistingFile([
		process.env.TLS_CERT,
		path.join(__dirname, "..", "certs", "fullchain.pem"),
		path.join(__dirname, "..", "certs", "cert.pem"),
		"/etc/letsencrypt/live/spacestation13clicker.ss13.site/fullchain.pem"
	]);
	const key = firstExistingFile([
		process.env.TLS_KEY,
		path.join(__dirname, "..", "certs", "privkey.pem"),
		path.join(__dirname, "..", "certs", "key.pem"),
		"/etc/letsencrypt/live/spacestation13clicker.ss13.site/privkey.pem"
	]);
	if (cert && key) {
		return {
			cert: fs.readFileSync(cert),
			key: fs.readFileSync(key)
		};
	}
	return null;
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
		activity: true
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
		return res.json({ access_token: payload.access_token });
	} catch (err) {
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

if (!fs.existsSync(path.join(DIST_PATH, "index.html"))) {
	console.warn(
		"[discord] dist/ is missing. Run `npm run build` before `npm start`."
	);
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
	console.log(
		"[discord] SS13 Idle listening on " + protocol + "://" + HOST + ":" + PORT
	);
	console.log(
		"[discord] Public URL: https://spacestation13clicker.ss13.site:" + PORT
	);
	if (!tls) {
		console.warn(
			"[discord] No TLS cert found. Discord Activities need HTTPS on this port."
		);
		console.warn(
			"[discord] Put fullchain.pem + privkey.pem in ./certs or set TLS_CERT / TLS_KEY."
		);
	}
	if (!CLIENT_ID || !CLIENT_SECRET) {
		console.warn(
			"[discord] Set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in .env"
		);
	}
});
