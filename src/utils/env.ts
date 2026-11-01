import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { AppEnv } from '../types/index.js';

export function getBindings<E extends AppEnv>({
    env: raw,
    req,
}: Context<E, string>) {
    const { AI, LANGUAGES } = raw;
    const { hostname } = new URL(req.url);
    if (hostname == raw.PROD_HOSTNAME) {
        return {
            AI,
            LANGUAGES,
            API_KEY: raw.PROD_API_KEY,
            APPLICATION_ID: raw.PROD_APPLICATION_ID,
            PUBLIC_KEY: raw.PROD_PUBLIC_KEY,
            BOT_TOKEN: raw.PROD_BOT_TOKEN,
        };
    }
    if (hostname == raw.DEV_HOSTNAME) {
        return {
            AI,
            LANGUAGES,
            API_KEY: raw.DEV_API_KEY,
            APPLICATION_ID: raw.DEV_APPLICATION_ID,
            PUBLIC_KEY: raw.DEV_PUBLIC_KEY,
            BOT_TOKEN: raw.DEV_BOT_TOKEN,
        };
    }
    throw new HTTPException(400, {
        message: 'This host is not configured.',
    });
}
