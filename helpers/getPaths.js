"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getPaths = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var buildPath_1 = __importDefault(require("./buildPath"));
var getPaths = function (initialPath, continueSeq) {
    if (continueSeq === void 0) { continueSeq = ""; }
    var calcPath = path_1["default"].join(process.cwd(), "files", (0, buildPath_1["default"])(initialPath), continueSeq);
    return new Promise(function (res) {
        fs_1["default"].readdir(calcPath, function (err, data) {
            if (err) {
                res([]);
                console.log(err);
            }
            if (data && data.length > 0 && data.length < 100) {
                var paths_1 = [];
                var done_1 = 0;
                data.forEach(function (file) {
                    if (file[0] !== ".") {
                        fs_1["default"].stat(path_1["default"].join(calcPath, file), function (err, stat) {
                            if (err) {
                                console.log(err);
                            }
                            if (stat.isDirectory()) {
                                (0, exports.getPaths)(initialPath, path_1["default"].join(continueSeq, file)).then(function (children) {
                                    children.forEach(function (child) {
                                        paths_1.push(child);
                                    });
                                    done_1++;
                                    if (done_1 === data.length) {
                                        res(paths_1);
                                    }
                                });
                            }
                            else {
                                done_1++;
                                paths_1.push(path_1["default"].join(continueSeq, file));
                                if (done_1 === data.length) {
                                    res(paths_1);
                                }
                            }
                        });
                    }
                    else {
                        done_1++;
                        if (done_1 === data.length) {
                            res(paths_1);
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
exports.getPaths = getPaths;
