const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const getPaths = require("./helpers/getPaths").getPaths;
const recursivelyGetFiles = require("./helpers/recursivelyGetFiles")["default"];
const path = require("path");
const fs = require("fs");
const getType = require("mime").getType;
const { isImportEqualsDeclaration } = require("typescript");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const getHost = (req) => {
	const host = req.headers.host;
	if (host) {
		const parts = host.split(".");
		if (parts.length && !parts[0].includes(":")) {
			return parts[0];
		} else {
			return "undefined";
		}
	}
	return "undefined";
};

app.prepare().then(() => {
	createServer((req, res) => {
		// Be sure to pass `true` as the second argument to `url.parse`.
		// This tells it to parse the query portion of the URL.
		const parsedUrl = parse(req.url, true);
		const { pathname, query } = parsedUrl;
		if (pathname === "/api/v1/files/search" && req.method === "POST") {
			let q = "";
			req.on("data", (chunk) => {
				q += chunk.toString();
			});
			req.on("end", () => {
				res.setHeader("content-type", "application/json");
				recursivelyGetFiles(getHost(req), typeof q === "string" ? q : "")
					.then((files) => {
						if (files.length > 0) {
							res.statusCode = 200;
							res.write(JSON.stringify(files));
							res.end();
						} else {
							res.statusCode = 200;
							res.write(JSON.stringify([]));
							res.end();
						}
					})
					.catch((err) => {
						console.log(err);
						res.write("[]");
						res.end();
					});
			});
		} else if (
			pathname.slice(0, "/api/v1/files/open/".length) === "/api/v1/files/open/"
		) {
			const filePath = decodeURIComponent(
				pathname.slice("/api/v1/files/open/".length)
			);
			if (filePath) {
				const host = getHost(req)
				getPaths(host)
					.then((paths) => {
						if (paths.includes(filePath)) {
							res.statusCode = 200;
							res.setHeader("Content-Type", getType(path.extname(filePath)));
							const readStream = fs.createReadStream(
								path.join(process.cwd(), "files", host, filePath).toString()
							);
							readStream.on("error", (err) => {
								console.log(err);
								res.statusCode = 404;
								res.setHeader("content-type", "application/json");
								res.write(JSON.stringify({ ok: false, error: "invalid path" }));
								res.end();
							});
							readStream.on("data", (chunk) => {
								res.write(chunk);
							});
							readStream.on("end", () => {
								res.end();
							});
							return true;
						} else {
							res.setHeader("content-type", "application/json");
							res.statusCode = 404;
							res.write(JSON.stringify({ ok: false, error: "Invalid path" }));
							res.end();
						}
					})
					.catch((err) => {
						console.log(err);
						res.statusCode = 404;
						res.setHeader("content-type", "application/json");
						res.write(JSON.stringify({ ok: false, error: "Invalid path" }));
						res.end();
					});
			} else {
				res.statusCode = 400;
				res.write(JSON.stringify({ ok: false, error: "Invalid path" }));
				res.end();
			}
		} else {
			handle(req, res, parsedUrl);
		}
	}).listen(dev ? 3000 : 80, (err) => {
		if (err) throw err;
		console.log("> Ready on http://localhost:" + (dev ? 3000 : 80));
	});
});
