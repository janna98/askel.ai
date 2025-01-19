import {singleton} from "~/utils/singleton.server";
import OpenAI from "openai";

export const ai = singleton("ai", () => {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
});

