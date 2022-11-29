import 'server-only';
import cuid from 'cuid';
import { client } from '../redis';

const createChatRoom = async (mainUserId: string, otherUserId: string) => {
  // Create a randomId to become the roomId
  const randomRoomId = cuid();
  //Add this room to both user:rooms
  Promise.all([
    await client.sadd(`user:${mainUserId}:rooms`, randomRoomId),
    await client.sadd(`user:${otherUserId}:rooms`, randomRoomId),
  ]);

  // Add both the user's id the the room
  Promise.all([
    await client.sadd(`room:${randomRoomId}:users`, mainUserId),
    await client.sadd(`room:${randomRoomId}:users`, otherUserId),
  ]);

  return;
};

export const getAllChatRoomsIds = async (mainUserId: string) => {
  const allChatRooms = await client.smembers(`user:${mainUserId}:rooms`);
  //If there is no chat rooms available create a default chat room with default user
  if (allChatRooms.length <= 0) {
    const defaultUserId = process.env.DEFAULT_USER_HAO_ID;
    if (defaultUserId) {
      await createChatRoom(mainUserId, defaultUserId);
    }
    return await client.smembers(`user:${mainUserId}:rooms`);
  }
  return allChatRooms;
};
