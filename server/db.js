const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

const DATA_DIR = process.env.DATA_DIR
	? path.resolve(process.env.DATA_DIR)
	: path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "saves.sqlite");

if (!fs.existsSync(DATA_DIR)) {
	fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);
db.exec(`
	CREATE TABLE IF NOT EXISTS sessions (
		token_hash TEXT PRIMARY KEY,
		user_id TEXT NOT NULL,
		username TEXT,
		locale TEXT,
		created_at INTEGER NOT NULL,
		expires_at INTEGER NOT NULL
	);
	CREATE TABLE IF NOT EXISTS saves (
		user_id TEXT PRIMARY KEY,
		payload TEXT NOT NULL,
		updated_at INTEGER NOT NULL,
		revision INTEGER NOT NULL DEFAULT 1
	);
	CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`);

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function hashToken(token) {
	return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function createSession(user) {
	const token = crypto.randomBytes(32).toString("hex");
	const now = Date.now();
	db.prepare(
		`INSERT INTO sessions (token_hash, user_id, username, locale, created_at, expires_at)
		 VALUES (?, ?, ?, ?, ?, ?)`
	).run(
		hashToken(token),
		String(user.id),
		user.username || user.global_name || "",
		user.locale || "",
		now,
		now + SESSION_TTL_MS
	);
	return token;
}

function getSession(token) {
	if (!token) return null;
	const row = db.prepare(
		`SELECT user_id, username, locale, expires_at FROM sessions WHERE token_hash = ?`
	).get(hashToken(token));
	if (!row) return null;
	if (Number(row.expires_at) < Date.now()) {
		db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(hashToken(token));
		return null;
	}
	return {
		userId: row.user_id,
		username: row.username,
		locale: row.locale
	};
}

function getSave(userId) {
	const row = db.prepare(
		`SELECT payload, updated_at, revision FROM saves WHERE user_id = ?`
	).get(String(userId));
	if (!row) return null;
	return {
		save: JSON.parse(row.payload),
		updatedAt: Number(row.updated_at),
		revision: Number(row.revision)
	};
}

function putSave(userId, save, clientUpdatedAt) {
	const existing = getSave(userId);
	const incomingUpdatedAt = Number(clientUpdatedAt) || Date.now();
	if (existing && incomingUpdatedAt < existing.updatedAt) {
		return { conflict: true, current: existing };
	}
	const revision = existing ? existing.revision + 1 : 1;
	const updatedAt = Math.max(incomingUpdatedAt, Date.now());
	db.prepare(
		`INSERT INTO saves (user_id, payload, updated_at, revision)
		 VALUES (?, ?, ?, ?)
		 ON CONFLICT(user_id) DO UPDATE SET
		 	payload = excluded.payload,
		 	updated_at = excluded.updated_at,
		 	revision = excluded.revision`
	).run(String(userId), JSON.stringify(save), updatedAt, revision);
	return { conflict: false, updatedAt, revision };
}

function stats() {
	const saves = db.prepare(`SELECT COUNT(*) AS n FROM saves`).get();
	const sessions = db.prepare(`SELECT COUNT(*) AS n FROM sessions`).get();
	return {
		saves: Number(saves && saves.n) || 0,
		sessions: Number(sessions && sessions.n) || 0,
		path: DB_PATH
	};
}

module.exports = {
	createSession,
	getSession,
	getSave,
	putSave,
	stats,
	DB_PATH
};
