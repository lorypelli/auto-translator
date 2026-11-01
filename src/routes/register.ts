import { Hono } from 'hono';
import { COMMANDS } from '../cmd/index.js';
import { registerCommands } from '../discord/index.js';
import { authApi } from '../middleware/index.js';
import type { AppEnv } from '../types/index.js';
import { getBindings } from '../utils/index.js';

export const register = new Hono<AppEnv>();

register.post('/', authApi, async (ctx) => {
    await registerCommands(
        getBindings(ctx),
        COMMANDS.map((command) => command.data),
    );
    return ctx.json({
        success: true,
    });
});
