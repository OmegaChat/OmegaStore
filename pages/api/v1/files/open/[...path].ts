import { NextApiRequest, NextApiResponse } from "next";
import { getPaths } from "../../../../../helpers/getPaths";
import path from "path";
import fs from "fs";
import { getType } from "mime";

export default (req: NextApiRequest, res: NextApiResponse) => {
	if (Array.isArray(req.query.path)) {
		getPaths("")
			.then((paths) => {
				if (
					Array.isArray(req.query.path) &&
					paths.includes(req.query.path.join("/"))
				) {
					res.status(200);
					res.setHeader(
						"Content-Type",
						getType(path.extname(req.query.path.join("/")))
					);
					const readStream = fs.createReadStream(
						path.join(process.cwd(), req.query.path.join("/"))
					);
					readStream.on("data", (chunk) => {
						res.write(chunk);
					});
					readStream.on("end", () => {
						res.end();
					});
					return true;
				} else {
					return res.status(400).json({ ok: false, error: "Invalid path" });
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(404).send([]);
			});
	} else {
		return res.status(400).send({ ok: false, error: "no path specified" });
	}
};
