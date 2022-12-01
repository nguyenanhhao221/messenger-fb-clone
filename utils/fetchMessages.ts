import type { TMessage } from '../type';

/**
 * @param {string} endpoint - the endpoint to the api route
 * @returns - All value stored in the provided key
 */
export const fetchMessages = async (endpoint: string) => {
  try {
    const res = await fetch(endpoint);
    if (res.ok) {
      const jsonResponse: TMessage[] = await res.json();
      return jsonResponse;
    }
    throw new Error('Network error');
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error, check console for more detail');
  }
};
