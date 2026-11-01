import type { APIInteraction } from 'discord-api-types/v10';

export type Bindings = {
    PUBLIC_KEY: string;
    APPLICATION_ID: string;
    BOT_TOKEN: string;
    API_KEY: string;
    AI: Ai;
    LANGUAGES: KVNamespace;
};

export type RawBindings = {
    PROD_HOSTNAME: string;
    PROD_PUBLIC_KEY: string;
    PROD_APPLICATION_ID: string;
    PROD_BOT_TOKEN: string;
    PROD_API_KEY: string;
    DEV_HOSTNAME: string;
    DEV_PUBLIC_KEY: string;
    DEV_APPLICATION_ID: string;
    DEV_BOT_TOKEN: string;
    DEV_API_KEY: string;
    AI: Ai;
    LANGUAGES: KVNamespace;
};

export type AppEnv = {
    Bindings: RawBindings;
};

export type DiscordEnv = {
    Bindings: RawBindings;
    Variables: {
        interaction: APIInteraction;
    };
};

export type ChatEnv = {
    Bindings: RawBindings;
    Variables: {
        language: string;
        messages: string[];
    };
};
