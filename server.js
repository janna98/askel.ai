import {createRequestHandler} from "@remix-run/express";
import express from "express";
import * as path from "path";

const setup = async () => {
    const viteDevServer =
        process.env.NODE_ENV === "production"
            ? null
            : await import("vite").then((vite) =>
                vite.createServer({
                    server: {middlewareMode: true},
                })
            );

    const app = express();
    app.use(
        viteDevServer
            ? viteDevServer.middlewares
            : express.static("build/client")
    );

    const build = viteDevServer
        ? () =>
            viteDevServer.ssrLoadModule(
                "virtual:remix/server-build"
            )
        : await import("./build/server/index.js");

    app.all("*", createRequestHandler({build}));

    app.listen(3000, () => {
        console.log("App listening on http://localhost:3000");
    });
}

const setupRootDir = async () => {
    const __dirname = path.resolve(path.dirname(''));
    global.appRoot = path.resolve(__dirname);
}

await setup();
await setupRootDir();

//const csvPath = __dirname + '/files/employee_data.csv';

