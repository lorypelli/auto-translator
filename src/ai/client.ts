import * as z from 'zod';
import type { Bindings, JsonObject } from '../types/index.js';
import { orNullWithin, parseJsonObject } from '../utils/index.js';
import { INVALID_RESPONSE_ERROR } from './errors.js';

const MODEL = '@cf/google/gemma-4-26b-a4b-it';
const ATTEMPT_TIMEOUT_MS = 12000;

type AskOptions = {
    deterministic?: boolean;
    retry?: boolean;
};

export async function ask<S extends z.ZodType>(
    env: Bindings,
    prompt: string,
    schema: S,
    input: JsonObject,
    { deterministic = true, retry = true }: AskOptions = {},
): Promise<z.infer<S>> {
    const request = env.AI.run(MODEL, {
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'reply',
                strict: true,
                schema: z.toJSONSchema(schema),
            },
        },
        chat_template_kwargs: {
            enable_thinking: false,
        },
        ...(deterministic && {
            temperature: 0,
        }),
        messages: [
            {
                role: 'system',
                content: prompt,
            },
            {
                role: 'user',
                content: JSON.stringify(input),
            },
        ],
    });
    const completion = await orNullWithin(request, ATTEMPT_TIMEOUT_MS);
    if (completion) {
        const [choice] = completion.choices || [];
        const reply = await parseJsonObject(choice?.message?.content || '');
        const result = schema.safeParse(reply);
        if (!result.success) {
            throw new Error(INVALID_RESPONSE_ERROR);
        }
        return result.data;
    }
    if (retry) {
        return ask(env, prompt, schema, input, {
            deterministic,
            retry: false,
        });
    }
    throw new Error('The AI request failed, try again later.');
}
