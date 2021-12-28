import { useEffect, useState } from "react";
import fs from "fs";
import path from "path";
import buildPath from "../helpers/buildPath";

export const replaceLast = (str: string, find: string, replace: string) => {
	const index = str.lastIndexOf(find);
	if (index > -1) {
		return (
			str.substring(0, index) + replace + str.substring(index + find.length)
		);
	}
	return str;
};

interface file {
	path: string;
	isFile: Boolean;
	name: string;
	children: file[];
}

interface props {
	rootFiles: file[];
}

const FileExplorer = (props: props) => {
	const [rows, setRows] = useState<file[][]>([props.rootFiles]);
	const [state, setState] = useState<number>(0);
	const [search, setSearch] = useState<string>("");
	const [searchResults, setSearchResults] = useState<file[]>([]);
	useEffect(() => {
		if (search.length > 0) {
			fetch(window.location.origin + "/api/v1/files/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: search,
				}),
				credentials: "include",
			}).then((r) => {
				r.json().then((res) => {
					setSearchResults(res);
				});
			});
		} else {
			setSearchResults([]);
		}
	}, [search]);
	return (
		<div className="content">
			<div className="content__search">
				<input
					onChange={({ target: { value } }) => {
						setSearch(value);
					}}
					placeholder="Search"
					type="text"
					className="search__input"
				></input>
				{searchResults.length > 0 ? (
					<div className="search__results">
						{searchResults.map((r) => (
							<a
								target="_blank noopener noreferrer"
								href={
									"/api/v1/files/open/" +
									replaceLast(encodeURIComponent(r.path), "%2F", "/")
								}
							>
								<div
									className="results__result"
									onClick={() => {
										setSearchResults([]);
									}}
								>
									{r.name}
								</div>
							</a>
						))}
					</div>
				) : undefined}
			</div>
			<h1 className="content__title">File Explorer</h1>
			<div className="content__rows">
				{rows.length
					? rows.map((row, rowIndex) => {
							return (
								<div key={rowIndex} className="rows__row">
									{row.length ? (
										row.map((file: file) => {
											if (file.isFile) {
												<a
													target="_blank noopener noreferrer"
													href={
														"/api/v1/files/open/" +
														replaceLast(
															encodeURIComponent(file.path),
															"%2F",
															"/"
														)
													}
												>
													{}
												</a>;
												return (
													<a
														target="_blank noopener noreferrer"
														href={
															"/api/v1/files/open/" +
															replaceLast(
																encodeURIComponent(file.path),
																"%2F",
																"/"
															)
														}
													>
														<p
															onClick={() => {
																if (!file.isFile) {
																	rows[rowIndex + 1] = file.children;
																	rows.length = rowIndex + 2;
																	setState(state + 1);
																	setRows(rows);
																}
															}}
															className={
																"row__item" +
																(file.isFile ? "" : " row__folder")
															}
															key={file.path}
														>
															{file.name}
														</p>
													</a>
												);
											} else {
												return (
													<p
														onClick={() => {
															if (!file.isFile) {
																rows[rowIndex + 1] = file.children;
																rows.length = rowIndex + 2;
																setState(state + 1);
																setRows(rows);
															}
														}}
														className={
															"row__item" + (file.isFile ? "" : " row__folder")
														}
														key={file.path}
													>
														{file.name}
													</p>
												);
											}
										})
									) : (
										<p className="rows__nocontent">No files found</p>
									)}
								</div>
							);
					  })
					: undefined}
			</div>
		</div>
	);
};

export default FileExplorer;



export const recursivelyGetFiles = (
	initialPath: string,
	search?: string
): Promise<file[]> => {
	const calcPath = path.join(process.cwd(), "files", buildPath(initialPath));
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
					fs.stat(path.join(calcPath, file), (err, stat) => {
						if (err) {
							console.log(err);
						}
						const fileObj: file = {
							name: file,
							path: path.join(initialPath || "", file),
							isFile: stat.isFile(),
							children: [],
						};
						if (stat.isDirectory()) {
							recursivelyGetFiles(path.join(initialPath, file), search).then(
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
				});
			} else {
				res([]);
			}
		});
	});
};

export const getServerSideProps = (
	context
): Promise<{
	props: { rootFiles: file[] };
}> => {
	const host = context.req.headers.host;
	let topLevelHost = host;
	if (host) {
		topLevelHost = host.split(".")[0]
	} else {
		topLevelHost = "undefined";
	}
	if (topLevelHost.includes(":")) {
		topLevelHost = "undefined"
	}
	return new Promise((res) => {
		recursivelyGetFiles(topLevelHost)
			.then((e) => {
				res({
					props: {
						rootFiles: e,
					},
				});
			})
			.catch((err) => {
				console.log(err);
				res({ props: { rootFiles: [] } });
			});
	});
};
