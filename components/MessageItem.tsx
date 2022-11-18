'use client';
import Image from 'next/image';
import React from 'react';
import type { TMessage } from '../type';

type Props = {
  message: TMessage;
  lastItem: boolean;
};

export const MessageItem = ({ message, lastItem }: Props) => {
  //TODO Update actually logic to check if it is user, use hard code for now
  const isUser = true;

  return (
    <div
      className={`flex items-center gap-2 ${
        isUser ? `justify-end` : `justify-start`
      }`}
    >
      <Image
        src={message.profilePic}
        alt={`${message.username}'s profile picture`}
        width={300}
        height={300}
        className={`h-12 w-12 rounded-full ${isUser ? `order-2` : `order-1`} ${
          isUser && lastItem ? `block` : `hidden`
        }`}
      />
      <div
        className={`flex flex-col gap-2 ${
          isUser ? `items-end` : `order-2 items-start`
        }`}
      >
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
