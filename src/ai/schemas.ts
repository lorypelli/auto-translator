import * as z from 'zod';

export const TRANSLATE_SCHEMA = z.object({
    translations: z.array(z.string()),
});
export const LANGUAGE_NAME_SCHEMA = z.object({
    kind: z.enum(['name', 'code', 'other']),
    language: z.string().optional(),
});
export const LANGUAGES_SCHEMA = z.object({
    languages: z.array(z.string()),
});
export const DETECT_LANGUAGE_SCHEMA = z.object({
    language: z.string(),
});
export const SUMMARY_SCHEMA = z.object({
    summary: z.string(),
});

export function boundarySchema(key: 'start' | 'end') {
    return z.object({
        [key]: z.int(),
    });
}
