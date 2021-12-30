import path from "path";
import fs from "fs";
import { getPageFiles } from "next/dist/server/get-page-files";
import buildPath from "./buildPath";

export const getPaths = (initialPath: string, continueSeq: string = ""): Promise<string[]> => {
	const calcPath = path.join(process.cwd(), "files", buildPath(initialPath), continueSeq);
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
					if (file[0] !== ".") {
						fs.stat(path.join(calcPath, file), (err, stat) => {
							if (err) {
								console.log(err);
							}
							if (stat.isDirectory()) {
								getPaths(initialPath, path.join(continueSeq, file)).then((children) => {
									children.forEach((child) => {
										paths.push(child);
									});
									done++;
									if (done === data.length) {
										res(paths);
									}
								});
							} else {
								done++;
								paths.push(path.join(continueSeq, file));
								if (done === data.length) {
									res(paths);
								}
							}
						});
					} else {
						done++;
						if (done === data.length) {
							res(paths);
						}
					}
				});
			} else {
				res([]);
			}
		});
	});
};
