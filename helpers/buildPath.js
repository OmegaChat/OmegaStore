"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.replaceAll = void 0;
var path_1 = __importDefault(require("path"));
var replaceAll = function (str, find, replace) { return str.split(find).join(replace); };
exports.replaceAll = replaceAll;
var makeSlashPart = function (str, host) { return path_1["default"].join(__dirname, "..", host, str); };
exports["default"] = (function (path) { return (0, exports.replaceAll)((0, exports.replaceAll)((0, exports.replaceAll)((0, exports.replaceAll)(path, '../', ""), '..', ''), "$", ""), "-", ''); });
