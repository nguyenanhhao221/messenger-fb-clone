import Image from 'next/image';
import React from 'react';
import type { TChatRoom } from '../../type';

type Props = {
  chatRoomInfo: TChatRoom;
};
export const ChatRoomsPreview = ({ chatRoomInfo }: Props) => {
  return (
    <div>
      <Image
        src={chatRoomInfo.image}
        alt="avatar"
        width={300}
        height={300}
        className="h-12 w-12 rounded-full"
      />
      <div>{chatRoomInfo.name}</div>
    </div>
  );
};
