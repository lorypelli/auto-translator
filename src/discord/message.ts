import type { APIMessage } from 'discord-api-types/v10';
import type { Bindings } from '../types/index.js';
import { getMessages } from './channel.js';

const MESSAGE_PATH_REGEX =
    /^\/channels\/[^/]+\/(?<channel>\d+)\/(?<id>\d+)\/?$/;
const SNOWFLAKE_REGEX = /^\d{17,20}$/;

export const MAX_MESSAGES = 100;

export type MessageReference = {
    channelId: string | null;
    messageId: string;
};

type MessageRange = {
    from: string | null;
    to: string | null;
};

export function parseMessageReference(text: string): MessageReference | null {
    const groups = URL.parse(text)?.pathname.match(MESSAGE_PATH_REGEX)?.groups;
    const messageId = groups?.id || text;
    if (!SNOWFLAKE_REGEX.test(messageId)) {
        return null;
    }
    return {
        channelId: groups?.channel || null,
        messageId,
    };
}

export function isInChannel(
    { channelId }: MessageReference,
    currentChannelId: string,
) {
    return !channelId || channelId == currentChannelId;
}

export function parseMessageRange(
    from: string | null,
    to: string | null,
    channelId: string,
): MessageRange | null {
    const fromReference = from ? parseMessageReference(from) : null;
    const toReference = to ? parseMessageReference(to) : null;
    if ((from && !fromReference) || (to && !toReference)) {
        return null;
    }
    if (
        (fromReference && !isInChannel(fromReference, channelId)) ||
        (toReference && !isInChannel(toReference, channelId))
    ) {
        return null;
    }
    return {
        from: fromReference?.messageId || null,
        to: toReference?.messageId || null,
    };
}

export function getMessageText({
    content,
    message_snapshots: snapshots = [],
}: APIMessage) {
    if (content) {
        return content;
    }
    return snapshots
        .map(({ message }) => message.content)
        .filter(Boolean)
        .join('\n');
}

function isChatMessage(
    { APPLICATION_ID }: Bindings,
    {
        author,
        interaction_metadata: metadata,
        webhook_id: webhookId,
    }: APIMessage,
) {
    if (author.id == APPLICATION_ID || metadata) {
        return false;
    }
    return !author.bot || Boolean(webhookId);
}

function getQuery({ from, to }: MessageRange, limit: number) {
    if (from) {
        const after = `${BigInt(from) - 1n}`;
        return new URLSearchParams({
            after,
            limit: `${MAX_MESSAGES}`,
        });
    }
    if (to) {
        const before = `${BigInt(to) + 1n}`;
        return new URLSearchParams({
            before,
            limit: `${MAX_MESSAGES}`,
        });
    }
    return new URLSearchParams({
        limit: `${limit}`,
    });
}

function isTruncated(fetched: APIMessage[], { from, to }: MessageRange) {
    if (!from || !to || fetched.length < MAX_MESSAGES) {
        return false;
    }
    return fetched.every(({ id }) => BigInt(id) < BigInt(to));
}

export async function getChatMessages(
    env: Bindings,
    channelId: string,
    range: MessageRange,
    limit = MAX_MESSAGES,
) {
    const query = getQuery(range, limit);
    const newestFirst = await getMessages(env, channelId, query);
    const messages = newestFirst
        .toReversed()
        .filter((message) => isChatMessage(env, message))
        .map((message) => ({
            ...message,
            content: getMessageText(message),
        }))
        .filter(
            ({ content, id }) =>
                content && (!range.to || BigInt(id) <= BigInt(range.to)),
        );
    return {
        messages,
        truncated: isTruncated(newestFirst, range),
    };
}
