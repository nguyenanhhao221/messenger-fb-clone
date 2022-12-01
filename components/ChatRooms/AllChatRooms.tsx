import type { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import type { TMessage } from '../../type';
import { ChatRoomsPreview } from './ChatRoomPreview';

type Props = {
  initialMessages: { roomId: string; messageData: TMessage[] }[];
  session: Session;
};

export const AllChatRooms = ({ initialMessages, session }: Props) => {
  return (
    <div>
      {initialMessages?.map((chatroom) => (
        <Link
          href={`/room/${chatroom.roomId}`}
          key={chatroom.roomId}
          className="py-4 px-4"
        >
          <ChatRoomsPreview
            session={session}
            firstMessage={chatroom.messageData[0]}
          />
        </Link>
      ))}
    </div>
  );
};
