import {db} from "~/utils/db.server";

export function findEmployees() {
    return db.employee.findMany({
        select: {
            id: true,
            name: true,
            department: true,
            performanceReview: true,
        },
    })
}

interface EmployeeCreate {
    name: string;
    department: string;
    performanceReview: string;
}

export function upsertEmployee(data: EmployeeCreate) {
    return db.$transaction(async (tx) => {
        return await tx.employee.upsert({
            select: {id: true},
            where: {
                name: data.name,
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