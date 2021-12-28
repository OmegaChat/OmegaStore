import path from "path";
import fs from "fs";
import { getPageFiles } from "next/dist/server/get-page-files";
import buildPath from "./buildPath";

export const getPaths = (initialPath: string): Promise<string[]> => {
	const calcPath = path.join(process.cwd(), "files", buildPath(initialPath));
	return new Promise((res) => {
		fs.readdir(calcPath, (err, data) => {
			if (err) {
				res([]);
				console.log(err);
			}
			if (data && data.length > 0 && data.length < 100) {
				const paths: string[] = [];
				let done = 0;
				data.forEach((file) => {
					fs.stat(path.join(calcPath, file), (err, stat) => {
						if (err) {
							console.log(err);
						}
						if (stat.isDirectory()) {
							getPaths(path.join(initialPath, file)).then((children) => {
								children.forEach((child) => {
									paths.push(child);
								})
								done++;
								if (done === data.length) {
									res(paths);
								}
							})
						} else {
                            done++;
                            paths.push(path.join(initialPath, file));
                            if (done === data.length) {
                                res(paths);
                            }
                        }
                        });
				});
			} else {
				res([]);
			}
		});
	});
}
