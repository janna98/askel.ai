import {singleton} from "~/utils/singleton.server";
import NodeCache from "node-cache";

export const cache = singleton("cache", () => new NodeCache({stdTTL: 3600, checkperiod: 1200}));
