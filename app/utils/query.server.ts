import {ai, embeddingType, model} from "~/utils/openai.server";
import similarity from "compute-cosine-similarity";
import {findEmbeddings} from "~/repositories/embedding.server";
import {encoding_for_model} from "tiktoken";


export function tokenLength(text: string): number {
    const encoding = encoding_for_model(model);
    return encoding.encode(text).length;
}

export async function rankRelatedness(query: string, topResults: number = 100) {
    const context = await findEmbeddings();
    try {
        const embeddingResponse = await ai.embeddings.create({
            model: embeddingType,
            input: query,
            encoding_format: "float",
        });
        const queryEmbedding = embeddingResponse.data[0]?.embedding;

        const similarities = [];
        for (const row of context) {
            const rowEmbedding = JSON.parse(row.embeddings);
            const text = `Name: ${row.employee.name}, Department: ${row.employee.department}, Performance review: ${row.employee.performanceReview}`
            similarities[row.id] = [text, similarity(queryEmbedding, rowEmbedding)];
        }

        similarities.sort((a, b) => b[1] - a[1]);
        return similarities.slice(0, topResults);
    } catch (error) {
        console.error('Error ranking embeddings relations: ', error);
        throw error;
    }
}