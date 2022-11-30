import type { TMessage } from '../type';

/**
 *
 * @param {string} key - The key in the UpStash to query its value
 * @returns - All value stored in the provided key
 */
//TODO Update valid key base on different chat conversation
export const fetchMessages = async (
  roomId: string
): Promise<{ result: TMessage[] }> => {
  const endpoint = `api/getMessages`;
  try {
    const res = await fetch(endpoint);
    if (res.ok) {
      const jsonResponse = res.json();
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
