const webpack = require("webpack");
const fs = require("fs");
const path = require("path");

// webpack 4 + OpenSSL 3 / Node 17+
const crypto = require("crypto");
const origCreateHash = crypto.createHash;
crypto.createHash = function (algorithm) {
	return origCreateHash.call(crypto, algorithm === "md4" ? "sha256" : algorithm);
};

function bundleDiscordSdk() {
	const esbuild = require("esbuild");
	const entry = path.join(
		__dirname,
		"node_modules/@discord/embedded-app-sdk/output/index.cjs"
	);
	const outfile = path.join(__dirname, "public/discord-sdk.js");
	if (!fs.existsSync(entry)) {
		console.warn("[discord] @discord/embedded-app-sdk is not installed");
		return;
	}
	esbuild.buildSync({
		entryPoints: [entry],
		bundle: true,
		format: "iife",
		globalName: "DiscordEmbeddedAppSdk",
		platform: "browser",
		outfile,
		logLevel: "warning"
	});
}

bundleDiscordSdk();

const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;

module.exports = {
	publicPath: process.env.FULL_PATH ? "/space-station-13-idle/" : "/",

	devServer: {
		port: Number(process.env.DEV_PORT || 8080),
		disableHostCheck: true,
		headers: {
			"Access-Control-Allow-Origin": "*"
		}
	},

	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				"process.env.PACKAGE_VERSION": JSON.stringify(version)
			})
		],
		performance: {
			hints: false
		}
	}
};
