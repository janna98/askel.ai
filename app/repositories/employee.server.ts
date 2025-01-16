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

export function createEmployee(name: string, department: string, performanceReview: string) {
    return db.$transaction(async (tx) => {
        return await tx.employee.create({
            select: {id: true},
            data: {
                name: name,
                department: department,
                performanceReview: performanceReview,
            }
        });
    });
}