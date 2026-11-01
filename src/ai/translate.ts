import type { Bindings } from '../types/index.js';
import { isStringArray } from '../utils/index.js';
import { ask } from './client.js';
import {
    INVALID_LANGUAGE_ERROR,
    INVALID_RESPONSE_ERROR,
    isInvalidResponse,
} from './errors.js';
import { TRANSLATE_PROMPT } from './prompts.js';

const CHUNK_SIZE = 10;

async function requestTranslations(
    env: Bindings,
    messages: string[],
    language: string,
) {
    const { translations } = await ask<'translations'>(env, TRANSLATE_PROMPT, {
        language,
        messages,
    });
    if (
        !isStringArray(translations) ||
        translations.length != messages.length
    ) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return translations;
}

async function translateChunk(
    env: Bindings,
    messages: string[],
    language: string,
): Promise<string[]> {
    try {
        return await requestTranslations(env, messages, language);
    } catch (err) {
        if (!isInvalidResponse(err) || messages.length < 2) {
            throw err;
        }
        const middle = Math.ceil(messages.length / 2);
        const halves = await Promise.all([
            translateChunk(env, messages.slice(0, middle), language),
            translateChunk(env, messages.slice(middle), language),
        ]);
        return halves.flat();
    }
}

export async function translateMessages(
    env: Bindings,
    messages: string[],
    language: string,
) {
    if (!language.trim()) {
        throw new Error(INVALID_LANGUAGE_ERROR);
    }
    const chunks = Array.from(
        {
            length: Math.ceil(messages.length / CHUNK_SIZE),
        },
        (_, i) => messages.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
    );
    const translatedChunks = await Promise.all(
        chunks.map((chunk) => translateChunk(env, chunk, language)),
    );
    return translatedChunks.flat();
}

export async function translateText(
    env: Bindings,
    text: string,
    language: string,
) {
    const [translation = ''] = await translateMessages(env, [text], language);
    return translation;
}
