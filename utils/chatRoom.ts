import 'server-only';
import { client } from '../redis';

const createDefaultChatRoom = async (
  userId: string,
  defaultAccountId: string
) => {
  return await client.sadd(
    `user:${userId}:rooms`,
    `${userId}:${defaultAccountId}`
  );
};
export const loadAllChatRooms = async (
  userId: string,
  defaultAccountId: string
) => {
  const allChatRooms = await client.smembers(`user:${userId}:rooms`);
  //If there is no chat rooms available
  if (allChatRooms.length <= 0) {
    createDefaultChatRoom(userId, defaultAccountId);
    return await client.smembers(`user:${userId}:rooms`);
  }
  return allChatRooms;
};
