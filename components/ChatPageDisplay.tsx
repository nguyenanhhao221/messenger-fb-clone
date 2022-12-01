'use client';
import React, { useState } from 'react';
import { AllChatRooms } from '../components/ChatRooms/AllChatRooms';
import { MessageList } from '../components/MessageList';
import { ChatInput } from '../components/ChatInput';
import type { Session } from 'next-auth';
import type { TMessage } from '../type';

type Props = {
  initialMessages: { roomId: string; messageData: TMessage[] }[];
  session: Session;
};
export const ChatPageDisplay = ({ initialMessages, session }: Props) => {
  return (
    <div>
      <AllChatRooms initialMessages={initialMessages} session={session} />
      {/* MessageList */}
      {/* <MessageList initialMessage={initialMessage} session={session} /> */}
      {/* ChatInput */}
      {/* <ChatInput session={session} /> */}
    </div>
  );
};
