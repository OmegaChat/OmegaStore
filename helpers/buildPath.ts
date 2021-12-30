import path from "path";

export const replaceAll = (str: string, find: string, replace: string) => str.split(find).join(replace);

const makeSlashPart = (str: string, host: string) => path.join(__dirname, "..", host, str);

const buildPath = (path: string) => replaceAll(replaceAll(replaceAll(replaceAll(path, '../', ""), '..', ''), "$", ""), "-", '')

export default buildPath;