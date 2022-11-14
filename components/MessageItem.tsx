'use client';
import Image from 'next/image';
import React from 'react';
import type { TMessage } from '../type';

type Props = {
  message: TMessage;
};

export const MessageItem = ({ message }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={message.profilePic}
        alt={`${message.username}'s profile picture`}
        width={300}
        height={300}
        className="h-12 w-12 rounded-full"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm">{message.username}</p>
        <p className="whitespace-normal break-all rounded-2xl bg-fb-blue py-3 px-4">
          {message.message}
        </p>
        <p className="text-xs text-gray-200">
          {new Date(message.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
