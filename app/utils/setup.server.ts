import {approot} from "../../approot";
import {parseCsv} from "~/utils/parser.server";
import {getUniques} from "~/utils/array.server";
import {findEmployees, upsertEmployee} from "~/repositories/employee.server";
import {ai, embeddingType} from "~/utils/openai.server";
import {findEmbeddings, upsertEmbedding} from "~/repositories/embedding.server";

export async function setupEmployees() {
    console.log("Retrieving employee dataset")
    const filePath = approot + "/files/employee_data.csv";

    const headers = ['Name', 'Department', 'Performance review'];
    let employees = await parseCsv(filePath, headers);

    employees = getUniques(employees, 'Name');

    for (const employee of employees) {
        let performanceReview = employee['Performance review'];

        // remove repetitive nothing words
        performanceReview = performanceReview.replace(' Their ', '');
        performanceReview = performanceReview.replace('sets them apart as an invaluable member of the team.', '').trim();

        try {
            const employees = await findEmployees();
            if (employees.length !== 0) {
                console.log("Employees already in database, will not re-query");
                return;
            }
            await upsertEmployee({
                name: employee['Name'],
                department: employee['Department'],
                performanceReview: performanceReview
            });
        } catch (error) {
            console.log("Error upserting employee", error)
        }
    }
    console.log("Employees inserted from dataset");

    await getEmbeddings();
}

async function getEmbeddings() {
    const embeddings = await findEmbeddings();
    if (embeddings.length !== 0) {
        console.log("Embeddings already in database, will not re-query");
        return;
    }

    console.log("Creating dataset embeddings")
    const employees = await findEmployees();

    for (const employee of employees) {
        const text = `Name: ${employee.name}, Department: ${employee.department}, Performance review: ${employee.performanceReview}`
        const embedding = await ai.embeddings.create({
            model: embeddingType,
            input: text,
            encoding_format: "float",
        });

        try {
            await upsertEmbedding({
                employeeId: employee.id,
                embeddings: JSON.stringify(embedding.data[0]?.embedding)
            })
        } catch (error) {
            console.log("Error upserting embeddings", error)
        }
    }
    console.log("Employee vector embeddings inserted");
}