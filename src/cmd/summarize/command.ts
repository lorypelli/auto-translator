import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord-api-types/v10';
import {
    ANYWHERE,
    getBooleanOption,
    getStringOption,
} from '../../discord/index.js';
import type { Command } from '../../types/index.js';
import { autocompleteLanguage, MAX_LANGUAGE_LENGTH } from '../shared/index.js';
import {
    EPHEMERAL_DESCRIPTION,
    FROM_DESCRIPTION,
    LANGUAGE_DESCRIPTION,
    TO_DESCRIPTION,
} from './constants.js';
import { summarize } from './summarize.js';

export const SUMMARIZE_COMMAND: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.ChatInput,
        name: 'summarize',
        description: 'Summarize the latest conversation or a range of messages',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'language',
                description: LANGUAGE_DESCRIPTION,
                max_length: MAX_LANGUAGE_LENGTH,
                autocomplete: true,
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'from',
                description: FROM_DESCRIPTION,
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'to',
                description: TO_DESCRIPTION,
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'ephemeral',
                description: `${EPHEMERAL_DESCRIPTION} (default: true)`,
            },
        ],
    },
    autocomplete: autocompleteLanguage,
    run(interaction, runtime) {
        return summarize(interaction, runtime, {
            language: getStringOption(interaction, 'language'),
            ephemeral: getBooleanOption(interaction, 'ephemeral') ?? true,
            from: getStringOption(interaction, 'from'),
            to: getStringOption(interaction, 'to'),
        });
    },
};
