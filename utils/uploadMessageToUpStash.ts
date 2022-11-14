import type { TMessage } from '../type';

/**
 * @async
 * @function uploadMessageToUpStash
 * @param {TMessage} newMessage - The message object to be sent to the API
 * @returns The success status from the api
 */
export const uploadMessageToUpStash = async (
  newMessage: TMessage
): Promise<TMessage> => {
  const endpoint = 'api/addMessage';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: newMessage }),
  });
  if (res.ok) {
    const jsonResponse: { result: TMessage } = await res.json();
    return jsonResponse.result;
  }
  throw new Error('Network Error');
};
