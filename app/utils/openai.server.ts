import {singleton} from "~/utils/singleton.server";
import OpenAI from "openai";

export const embeddingType = 'text-embedding-3-small';
export const model = 'gpt-4o';

export const ai = singleton("ai", () => {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
});

