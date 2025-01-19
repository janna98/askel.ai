import {db} from "~/utils/db.server";

export function findEmbeddings() {
    return db.embedding.findMany({
        select: {
            id: true,
            employee: {
                select: {
                    name: true,
                    department: true,
                    performanceReview: true
                }
            },
            embeddings: true
        },
    })
}

interface EmbeddingCreate {
    employeeId: number;
    embeddings: string;
}

export function upsertEmbedding(data: EmbeddingCreate) {
    return db.$transaction(async (tx) => {
        return await tx.embedding.upsert({
            select: {id: true},
            where: {
                employeeId: data.employeeId,
            },
            update: {
                ...data,
            },
            create: {
                ...data,
            },
        });
    });
}