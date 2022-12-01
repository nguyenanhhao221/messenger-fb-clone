import Image from 'next/image';
import React from 'react';
import type { TMessage } from '../../type';
import type { Session } from 'next-auth';

type Props = {
  firstMessage: TMessage | undefined;
  session: Session;
};

//TODO implement read/unread message
export const ChatRoomsPreview = ({ firstMessage, session }: Props) => {
  if (!firstMessage) return <></>;
  //Get the preview username, if the current user is the owner of the preview message, then this play the word : You. Otherwise display the other's username
  const previewUsername =
    firstMessage.email === session.user?.email ? `You` : firstMessage.username;

  return (
    <div className="flex gap-2 px-4">
      <Image
        src={firstMessage.profilePic}
        alt="avatar"
        width={300}
        height={300}
        className="h-12 w-12 rounded-full"
      />
      <div>
        <h2 className="font-bold">{firstMessage.username}</h2>
        <p className="overflow-hidden truncate">
          {`${previewUsername}: ${firstMessage.message}`}
        </p>
      </div>
    </div>
  );
};
