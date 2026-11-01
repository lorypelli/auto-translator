export const INVALID_LANGUAGE_ERROR = 'That is not a valid language.';
export const INVALID_RESPONSE_ERROR =
    'The AI replied with an invalid response, try again.';

export function isInvalidResponse(err: unknown) {
    return err instanceof Error && err.message == INVALID_RESPONSE_ERROR;
}
