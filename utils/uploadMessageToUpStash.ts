import type { TMessage } from '../type';

/**
 * @async
 * @function uploadMessageToUpStash
 * @param {TMessage} message - The message object to be sent to the API
 * @returns The success status from the api
 */
export const uploadMessageToUpStash = async (
  message: TMessage
): Promise<{ data: number }> => {
  const endpoint = 'api/addMessage';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (res.ok) {
    const jsonResponse = await res.json();
    return jsonResponse;
  }
  throw new Error('Network Error');
};
