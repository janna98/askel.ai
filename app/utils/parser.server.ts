import * as fs from "fs";
import * as path from "path";
import {parse} from 'csv-parse';

export const parseCsv = async (location: string, headers: string[]) => {
    const filePath = path.resolve(location);

    const records = [];
    try {
        const parser = fs
            .createReadStream(filePath, {encoding: 'utf-8'})
            .pipe(parse({
                delimiter: ',',
                columns: headers,
                from_line: 2
            }));
        for await (const record of parser) {
            records.push(record);
        }
    } catch (error) {
        console.error(`Failed to parse file ${location}`, error);
    }

    return records;
};
