import fs from "fs";
import path from "path";
import buildPath from "./buildPath";

interface file {
	path: string;
	isFile: Boolean;
	name: string;
	children: file[];
}

export const recursivelyGetFiles = (    
	initialPath: string,
	search?: string,
    continueSeq: string = "",
): Promise<file[]> => {
	const calcPath = path.join(process.cwd(), "files", buildPath(initialPath), continueSeq);
	return new Promise((res) => {
		fs.readdir(calcPath, (err, data) => {
			if (err) {
				res([]);
				console.log(err);
			}
			if (data && data.length > 0 && data.length < 100) {
				const files: file[] = [];
				let done = 0;
				data.forEach((file) => {
					if (file[0] !== ".") {
						fs.stat(path.join(calcPath, file), (err, stat) => {
							if (err) {
								console.log(err);
							}
							const fileObj: file = {
								name: file,
								path: path.join(continueSeq, file),
								isFile: stat.isFile(),
								children: [],
							};
							if (stat.isDirectory()) {
								recursivelyGetFiles(initialPath, search,  path.join(continueSeq, file)).then(
									(children) => {
										fileObj.children = children;
										if (search) {
											children.forEach((child) => {
												files.push(child);
											});
										} else {
											files.push(fileObj);
										}
										done++;
										if (done === data.length) {
											res(files);
										}
									}
								);
							} else {
								if (
									!search ||
									(search && file.toLowerCase().includes(search.toLowerCase()))
								) {
									files.push(fileObj);
								}
								done++;
								if (done === data.length) {
									res(files);
								}
							}
						});
					} else {
						done++;
						if (done === data.length) {
							res(files);
						}
					}
				});
			} else {
				res([]);
			}
		});
	});
};
export default recursivelyGetFiles;