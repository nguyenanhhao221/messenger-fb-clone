import React from 'react';
import { redirect } from 'next/navigation';
import { ChatInput } from '../components/ChatInput';
import { MessageList } from '../components/MessageList';
import type { TMessage } from '../type';
import { unstable_getServerSession } from 'next-auth';

const HomePage = async () => {
  //Because this page is Render on the server, we can fetch the message data on the server, tell MessageList to render it as initial UI, then inside the MessageList on the client, it will refetch again to get the latest message and swap data
  // ! VERCEL_URL is only for deploy in Vercel
  const messageData: { result: TMessage[] } = await fetch(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/getMessages`
      : `http://localhost:3000/api/getMessages`
  ).then((res) => res.json());

  const session = await unstable_getServerSession();
  if (!session) {
    redirect('/auth/signin');
  }
  return (
    <main>
      {/* MessageList */}
      <MessageList initialMessage={messageData} session={session} />
      {/* ChatInput */}
      <ChatInput />
    </main>
  );
};

export default HomePage;
