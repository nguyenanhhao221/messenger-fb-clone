import React from 'react';
import { redirect } from 'next/navigation';
import type { TMessage } from '../type';
import { unstable_getServerSession } from 'next-auth';
import { ChatPageDisplay } from '../components/ChatPageDisplay';
import { Header } from '../components/Header';
import { getUserInfo } from '../utils/getUserInfo';
import { loadAllChatRooms } from '../utils/chatRoom';

const HomePage = async () => {
  const session = await unstable_getServerSession();
  if (!session) {
    redirect('/auth/signin');
  }
  if (!session.user) {
    return <div>User is not available in session, please sign in again</div>;
  }
  const { email, name, image } = session.user;
  if (
    typeof email !== 'string' ||
    !email ||
    typeof name !== 'string' ||
    typeof image !== 'string'
  )
    return <div>Email, Name or Image not available</div>;

  // Get User Information base on the session
  const userInfo = await getUserInfo(email, name, image);
  if (!userInfo)
    return <div>User info not available, problem with backend</div>;
  //Because this page is Render on the server, we can fetch the message data on the server, tell MessageList to render it as initial UI, then inside the MessageList on the client, it will refetch again to get the latest message and swap data
  // ! VERCEL_URL is only for deploy in Vercel
  const messageData: { result: TMessage[] } = await fetch(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/getMessages`
      : `http://localhost:3000/api/getMessages`
  ).then((res) => res.json());

  // Load All the Chat Rooms of that user
  const userId = userInfo.id;
  const defaultAccountId = process.env.DEFAULT_USER_HAO_ID;
  if (!defaultAccountId)
    return (
      <div>
        Default account id not available, double check database and env file
      </div>
    );
  const allChatRoom = await loadAllChatRooms(userId, defaultAccountId);

  console.log('🚀 ~ HomePage ~ allChatRoom', allChatRoom);

  return (
    <main>
      {/* @ts-expect-error Server Component */}
      <Header userId={userInfo.id} />
      <ChatPageDisplay session={session} initialMessage={messageData} />
    </main>
  );
};

export default HomePage;
