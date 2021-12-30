"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.recursivelyGetFiles = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var buildPath_1 = __importDefault(require("./buildPath"));
var recursivelyGetFiles = function (initialPath, search, continueSeq) {
    if (continueSeq === void 0) { continueSeq = ""; }
    var calcPath = path_1["default"].join(process.cwd(), "files", (0, buildPath_1["default"])(initialPath), continueSeq);
    return new Promise(function (res) {
        fs_1["default"].readdir(calcPath, function (err, data) {
            if (err) {
                res([]);
                console.log(err);
            }
            if (data && data.length > 0 && data.length < 100) {
                var files_1 = [];
                var done_1 = 0;
                data.forEach(function (file) {
                    if (file[0] !== ".") {
                        fs_1["default"].stat(path_1["default"].join(calcPath, file), function (err, stat) {
                            if (err) {
                                console.log(err);
                            }
                            var fileObj = {
                                name: file,
                                path: path_1["default"].join(continueSeq, file),
                                isFile: stat.isFile(),
                                children: []
                            };
                            if (stat.isDirectory()) {
                                (0, exports.recursivelyGetFiles)(initialPath, search, path_1["default"].join(continueSeq, file)).then(function (children) {
                                    fileObj.children = children;
                                    if (search) {
                                        children.forEach(function (child) {
                                            files_1.push(child);
                                        });
                                    }
                                    else {
                                        files_1.push(fileObj);
                                    }
                                    done_1++;
                                    if (done_1 === data.length) {
                                        res(files_1);
                                    }
                                });
                            }
                            else {
                                if (!search ||
                                    (search && file.toLowerCase().includes(search.toLowerCase()))) {
                                    files_1.push(fileObj);
                                }
                                done_1++;
                                if (done_1 === data.length) {
                                    res(files_1);
                                }
                            }
                        });
                    }
                    else {
                        done_1++;
                        if (done_1 === data.length) {
                            res(files_1);
                        }
                    }
                });
            }
            else {
                res([]);
            }
        });
    });
};
exports.recursivelyGetFiles = recursivelyGetFiles;
exports["default"] = exports.recursivelyGetFiles;
