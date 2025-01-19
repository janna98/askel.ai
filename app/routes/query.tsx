import type {LoaderFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {notImplemented} from "~/utils/http.server";
import {cache} from "~/utils/cache.server";
import {ai, model} from "~/utils/openai.server";
import {rankRelatedness, tokenLength} from "~/utils/query.server";

export const loader = () => notImplemented();

export async function action({request}: LoaderFunctionArgs) {
    const formData = await request.formData();
    let query = formData.get('query') as string;
    query = query.replace('\n', ' ').trim();

    if (cache.get(query)) {
        return json({success: cache.get(query)})
    }

    const relatedContext = await rankRelatedness(query, 100);

    const introduction = 'Use the below data on employees to answer the subsequent question. If the answer cannot be found, write "I could not find an exact match for your query."'
    const question = `\n\nQuestion: ${query}`
    let message = introduction;
    relatedContext.forEach(row => {
        const employeeText = `\n${row[0]}`
        if (tokenLength(message + employeeText + question) <= 500) {
            message = message.concat(employeeText);
        }
    })
    message = message.concat(question);
    try {
        const response = await ai.chat.completions.create({
            messages: [
                {
                    'role': 'system',
                    'content': 'You answer questions about employee data containing each persons name, department and performance reviews.'
                },
                {'role': 'user', 'content': message}
            ],
            model: model,
        });
        const responseContent = response.choices[0].message.content;
        cache.set(query, responseContent);

        return json({success: responseContent})
    } catch (err) {
        return json({error: err});
    }

}
