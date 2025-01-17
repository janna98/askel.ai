import {createRequestHandler} from "@remix-run/express";
import {parseCsv} from "~/utils/parser.server";
import {upsertEmployee} from "./app/repositories/employee.server";
import {getUniques} from "~/utils/array.server";
import {approot} from "./approot";
import express from "express";
import {ServerBuild} from "@remix-run/node";

const setupServer = async () => {
    const viteDevServer =
        process.env.NODE_ENV === "production"
            ? null
            : await import("vite").then((vite) =>
                vite.createServer({
                    server: {middlewareMode: true},
                })
            );

    const app = express();
    app.disable("x-powered-by");
    app.use(
        viteDevServer
            ? viteDevServer.middlewares
            : express.static("build/client", {immutable: true, maxAge: "1y"})
    );

    try {
        const build = viteDevServer
            ? await viteDevServer.ssrLoadModule("virtual:remix/server-build")
            : // @ts-expect-error - the file might not exist yet but it will
              // eslint-disable-next-line import/no-unresolved
            await import("../build/server/index.js");

        app.all("*", createRequestHandler({build}));
    } catch (error) {
        // Catch error and return null to make express happy and avoid an unrecoverable crash
        console.error("Error creating build:", error);
        return {error: error, build: null as unknown as ServerBuild};
    }


    app.listen(3000, () => {
        console.log("App listening on http://localhost:3000");
    });
}

async function setupEmployees() {
    const filePath = approot + "/files/employee_data.csv";

    const headers = ['Name', 'Department', 'Performance review'];
    let employees = await parseCsv(filePath, headers);

    employees = getUniques(employees, 'Name');

    for (const employee of employees) {
        await upsertEmployee({
            name: employee['Name'],
            department: employee['Department'],
            performanceReview: employee['Performance review']
        });
    }
}

await setupServer();
await setupEmployees();
