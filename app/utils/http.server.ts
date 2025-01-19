import {json} from "@remix-run/node";

export function notImplemented<Data = unknown>(data?: Data) {
    return json(data, {status: 501});
}