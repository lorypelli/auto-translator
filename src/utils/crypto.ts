import { timingSafeEqual } from 'node:crypto';

const encoder = new TextEncoder();

async function digest(text: string) {
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(text));
    return new Uint8Array(hash);
}

export async function safeEqual(a: string, b: string) {
    const [first, second] = await Promise.all([digest(a), digest(b)]);
    return timingSafeEqual(first, second);
}
