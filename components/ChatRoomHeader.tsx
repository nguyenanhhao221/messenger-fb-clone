import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import type { TMessage } from '../type';

type Props = {
  roomAvatar: TMessage['profilePic'];
  roomName: TMessage['username'];
};
export const ChatRoomHeader = ({ roomAvatar, roomName }: Props) => {
  return (
    <div className="flex items-center gap-4 py-2">
      <Link href="/" title="Go Back">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          className="h-6 w-6 stroke-fb-blue"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </Link>
      <div className="flex items-center gap-4">
        <Image
          src={roomAvatar}
          alt="room avatar"
          width={300}
          height={300}
          className="h-12 w-12 rounded-full"
        />
        <h3 className="text-lg font-bold">{roomName}</h3>
      </div>
    </div>
  );
};
