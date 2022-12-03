import { unstable_getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ChatInput } from '../../../components/ChatInput';
import { ChatRoomHeader } from '../../../components/ChatRooms/ChatRoomHeader';
import { MessageList } from '../../../components/MessageList';
import { client } from '../../../redis/redis';
import { TMessage } from '../../../type';
import { getUserInfo } from '../../../utils/getUserInfo';

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
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

  //Get Initial Message for the Room
  const roomId = params.roomId;
  //TODO check if user is authorized to view content in the room
  const initialRoomMessages: TMessage[] = (
    await client.hvals(`room:${roomId}:messages`)
  ).map((messageData) => JSON.parse(messageData));
  const firstMessage = initialRoomMessages[0];
  if (!firstMessage) return <>First message not available</>;
  return (
    <>
      <header className="sticky mb-4">
        <ChatRoomHeader
          roomName={firstMessage.username}
          roomAvatar={firstMessage.profilePic}
        />
      </header>
      <main>
        <MessageList
          roomId={roomId}
          session={session}
          initialRoomMessages={initialRoomMessages}
        />
        <ChatInput roomId={roomId} session={session} />
      </main>
    </>
  );
}
