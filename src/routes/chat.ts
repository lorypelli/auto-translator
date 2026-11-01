import { Hono } from 'hono';
import {
    getLanguageName,
    translateMessages,
    withTimeout,
} from '../ai/index.js';
import { authApi, validateChat } from '../middleware/index.js';
import type { ChatEnv } from '../types/index.js';
import { getBindings } from '../utils/index.js';

export const chat = new Hono<ChatEnv>();

chat.post('/', authApi, validateChat, async (ctx) => {
    const messages = ctx.get('messages');
    const language = ctx.get('language');
    const env = getBindings(ctx);
    const [translations] = await withTimeout(
        Promise.all([
            translateMessages(env, messages, language),
            getLanguageName(env, language),
        ]),
    );
    return ctx.json({
        success: true,
        translations,
    });
});
