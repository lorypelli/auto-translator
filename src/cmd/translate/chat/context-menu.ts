import { ApplicationCommandType } from 'discord-api-types/v10';
import {
    ANYWHERE,
    error,
    showModal,
    toCustomId,
} from '../../../discord/index.js';
import type { Command } from '../../../types/index.js';
import { MODAL_INPUTS } from './components.js';
import { MODAL_ID } from './constants.js';

export const TRANSLATE_CHAT_CONTEXT_MENU: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.User,
        name: 'Translate Chat',
    },
    run(interaction) {
        if (interaction.data.type != ApplicationCommandType.User) {
            return error('This can only be used on a user.');
        }
        const customId = toCustomId(MODAL_ID, interaction.data.target_id);
        return showModal(customId, 'Translate Chat', MODAL_INPUTS);
    },
};
