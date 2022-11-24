import React from 'react';
import { ChatRoomsPreview } from './ChatRoomPreview';

const chatRoomDummyData = [
  {
    id: 'randomId1',
    name: 'user1',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
  },
  {
    id: 'randomId2',
    name: 'user2',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
  },
  {
    id: 'randomId3',
    name: 'user3',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
  },
];
export const AllChatRooms = () => {
  return (
    <div>
      {chatRoomDummyData.map((chatroom) => (
        <div key={chatroom.id} className="py-4 px-4">
          <ChatRoomsPreview chatRoomInfo={chatroom} />
        </div>
      ))}
    </div>
  );
};
