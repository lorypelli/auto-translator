import { getModalCheckbox, getModalText } from '../../../discord/index.js';
import type { Modal } from '../../../types/index.js';
import { MODAL_ID } from './constants.js';
import { translateFromId, translateFromText } from './translate.js';

export const TRANSLATE_MESSAGE_MODAL: Modal = {
    id: MODAL_ID,
    run(interaction, runtime, messageId) {
        const text = getModalText(interaction, 'message');
        const options = {
            language: getModalText(interaction, 'language'),
            ephemeral: getModalCheckbox(interaction, 'ephemeral') ?? true,
        };
        if (text) {
            return translateFromText(interaction, runtime, text, options);
        }
        return translateFromId(
            interaction,
            runtime,
            {
                channelId: null,
                messageId,
            },
            options,
        );
    },
};
