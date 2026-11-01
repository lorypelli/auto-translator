import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { AppEnv } from '../types/index.js';
import { getBindings, safeEqual } from '../utils/index.js';

const BEARER_PREFIX = 'Bearer ';

export const authApi = createMiddleware<AppEnv>(async (ctx, next) => {
    const { API_KEY } = getBindings(ctx);
    const header = ctx.req.header('Authorization') || '';
    const key = header.startsWith(BEARER_PREFIX)
        ? header.slice(BEARER_PREFIX.length)
        : '';
    if (!key) {
        throw new HTTPException(401, {
            message: 'The API key is required in the Authorization header.',
        });
    }
    if (!API_KEY || !(await safeEqual(key, API_KEY))) {
        throw new HTTPException(403, {
            message: 'The API key is wrong.',
        });
    }
    await next();
});
