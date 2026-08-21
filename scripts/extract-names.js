const fs = require("fs");
const path = require("path");

function walk(dir, out) {
	fs.readdirSync(dir).forEach(function (name) {
		const full = path.join(dir, name);
		if (fs.statSync(full).isDirectory()) walk(full, out);
		else if (name.endsWith(".js")) out.push(full);
	});
}

function extractPairs(text) {
	const pairs = {};
	const re = /^[ \t]{1,2}([A-Za-z0-9_]+): \{[ \t]*\r?\n[ \t]+name:[ \t]*["']([^"']+)["']/gm;
	let match;
	while ((match = re.exec(text))) {
		pairs[match[1]] = match[2];
	}
	return pairs;
}

function mergeFromFiles(files) {
	const out = {};
	files.forEach(function (file) {
		Object.assign(out, extractPairs(fs.readFileSync(file, "utf8")));
	});
	return out;
}

const root = path.join(__dirname, "..", "src", "data");
const itemFiles = [];
walk(path.join(root, "items"), itemFiles);

const enemyFiles = [];
walk(path.join(root, "enemies"), enemyFiles);

const items = mergeFromFiles(itemFiles);
const enemies = mergeFromFiles(enemyFiles);
const purchases = Object.assign(
	{},
	extractPairs(fs.readFileSync(path.join(root, "shop.js"), "utf8")),
	extractPairs(fs.readFileSync(path.join(root, "recipesShop.js"), "utf8")),
	extractPairs(fs.readFileSync(path.join(root, "chrono.js"), "utf8"))
);
const upgrades = extractPairs(fs.readFileSync(path.join(root, "upgrades.js"), "utf8"));

const zones = {};
const zoneText = fs.readFileSync(path.join(root, "zones.js"), "utf8");
const zoneRe = /name:\s*"([^"]+)"/g;
let zm;
while ((zm = zoneRe.exec(zoneText))) {
	zones[zm[1]] = zm[1];
}

const result = { items, enemies, zones, purchases, upgrades };
const outPath = path.join(__dirname, "..", "src", "i18n", "_names-en.json");
fs.writeFileSync(outPath, JSON.stringify(result, null, "\t"));
console.log("items", Object.keys(items).length);
console.log("enemies", Object.keys(enemies).length);
console.log("zones", Object.keys(zones).length);
console.log("purchases", Object.keys(purchases).length);
console.log("upgrades", Object.keys(upgrades).length);
