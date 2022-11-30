import 'server-only';
import cuid from 'cuid';
import { client } from '../redis';
import type { TMessage } from '../type';

export const addDefaultMessage = async (roomId: string) => {
  const messageId = cuid();
  const defaultMessage: TMessage = {
    id: messageId,
    email: 'me@haonguyen.tech',
    username: 'Hào Nguyễn Dev',
    profilePic:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    message: 'Hello this is Hao',
    createdAt: Date.now(),
    roomId: roomId,
  };
  await client.hset(
    `room:${roomId}:messages`,
    messageId,
    JSON.stringify(defaultMessage)
  );
};
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

  return await addDefaultMessage(randomRoomId);
};

export const getAllChatRoomsIds = async (mainUserId: string) => {
  const allChatRooms = await client.smembers(`user:${mainUserId}:rooms`);
  //If there is no chat rooms available create a default chat room with default user
  // Then we will add a default message by the default user
  if (allChatRooms.length <= 0) {
    const defaultUserId = process.env.DEFAULT_USER_HAO_ID;
    if (defaultUserId) {
      await createChatRoom(mainUserId, defaultUserId);
    }
    return await client.smembers(`user:${mainUserId}:rooms`);
  }
  return allChatRooms;
};
