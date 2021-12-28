import { NextApiRequest, NextApiResponse } from "next";
import { recursivelyGetFiles } from "../../../files";

export default (req: NextApiRequest, res: NextApiResponse) => {
	return recursivelyGetFiles(
		"",
		typeof req.body.query === "string" ? req.body.query : ""
	)
		.then((files) => {
			if (files.length > 0) {
				res.status(200).json(files);
			} else {
				res.status(200).json([]);
			}
		})
		.catch((err) => {
			console.log(err);
			res.json([]);
		});
};
