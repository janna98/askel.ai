import {singleton} from "~/utils/singleton.server";
import path from "path";

export const approot = singleton("approot", () => {
    const __dirname = path.resolve(path.dirname(''));
    return path.resolve(__dirname);
});
