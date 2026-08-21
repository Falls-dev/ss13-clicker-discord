import { apiFetch, discordState } from "@/discord/activity";

export async function startDebugSession(userId) {
	const response = await apiFetch("/api/debug/session", {
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
