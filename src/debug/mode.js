export function isDebugRequested() {
	if (typeof window === "undefined") return false;
	try {
		const params = new URLSearchParams(window.location.search);
		if (params.get("debug") === "1") return true;
		if (window.localStorage.getItem("ss13-idle-debug") === "1") return true;
	} catch (err) {
		// ignore
	}
	return false;
}

export function persistDebugFlag(enabled) {
	try {
		if (enabled) window.localStorage.setItem("ss13-idle-debug", "1");
		else window.localStorage.removeItem("ss13-idle-debug");
	} catch (err) {
		// ignore
	}
}
