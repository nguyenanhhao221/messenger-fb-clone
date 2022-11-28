import cuid from 'cuid';
import 'server-only';
import { client } from '../redis';

const createDefaultChatRoom = async (
  userId: string,
  defaultAccountId: string
) => {
  // Create a randomId to become the roomId
  const randomRoomId = cuid();
  //Add this room to both user:rooms
  Promise.all([
    await client.sadd(`user:${userId}:rooms`, randomRoomId),
    await client.sadd(`user:${defaultAccountId}:rooms`, randomRoomId),
  ]);

  // Add both the user's id the the room
  Promise.all([
    await client.sadd(`room:${randomRoomId}:users`, userId),
    await client.sadd(`room:${randomRoomId}:users`, defaultAccountId),
  ]);

  return;
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
