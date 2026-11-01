import type { Bindings } from '../types/index.js';
import { orNull, toText } from '../utils/index.js';
import { ask } from './client.js';
import { INVALID_LANGUAGE_ERROR, INVALID_RESPONSE_ERROR } from './errors.js';
import {
    DETECT_LANGUAGE_PROMPT,
    LANGUAGE_NAME_PROMPT,
    RANDOM_LANGUAGES_PROMPT,
    SUGGEST_LANGUAGES_PROMPT,
} from './prompts.js';
import {
    DETECT_LANGUAGE_SCHEMA,
    LANGUAGE_NAME_SCHEMA,
    LANGUAGES_SCHEMA,
} from './schemas.js';

export async function getLanguageName(env: Bindings, input: string) {
    const { kind, language } = await ask(
        env,
        LANGUAGE_NAME_PROMPT,
        LANGUAGE_NAME_SCHEMA,
        {
            input,
        },
    );
    if (kind == 'other') {
        throw new Error(INVALID_LANGUAGE_ERROR);
    }
    const name = toText(language);
    if (!name) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return name;
}

export async function getLanguageSuggestions(env: Bindings, input: string) {
    const { languages } = await ask(
        env,
        SUGGEST_LANGUAGES_PROMPT,
        LANGUAGES_SCHEMA,
        {
            language: input,
        },
    );
    const checks = await Promise.all(
        languages.map((name) => orNull(getLanguageName(env, name))),
    );
    return languages.filter((_, i) => checks.at(i));
}

export async function getRandomLanguages(env: Bindings) {
    const { languages } = await ask(
        env,
        RANDOM_LANGUAGES_PROMPT,
        LANGUAGES_SCHEMA,
        {},
        {
            deterministic: false,
        },
    );
    return languages;
}

export async function detectLanguage(env: Bindings, text: string) {
    const { language } = await ask(
        env,
        DETECT_LANGUAGE_PROMPT,
        DETECT_LANGUAGE_SCHEMA,
        {
            text,
        },
    );
    const name = toText(language);
    if (!name) {
        throw new Error(INVALID_RESPONSE_ERROR);
    }
    return name;
}
