import {
    type APIInteraction,
    ApplicationIntegrationType,
    InteractionContextType,
    type RESTPostAPIBaseApplicationCommandsJSONBody,
} from 'discord-api-types/v10';

type CommandContext = Pick<
    RESTPostAPIBaseApplicationCommandsJSONBody,
    'contexts' | 'integration_types'
>;

export const ANYWHERE: CommandContext = {
    integration_types: [
        ApplicationIntegrationType.GuildInstall,
        ApplicationIntegrationType.UserInstall,
    ],
    contexts: [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel,
    ],
};

export function getReadableChannelId({
    authorizing_integration_owners: owners,
    channel,
}: APIInteraction) {
    if (!owners[ApplicationIntegrationType.GuildInstall]) {
        return null;
    }
    return channel?.id || null;
}
