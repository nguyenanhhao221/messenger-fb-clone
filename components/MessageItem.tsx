'use client';
import type { Session } from 'next-auth';
import Image from 'next/image';
import React from 'react';
import type { TMessage } from '../type';

type Props = {
  message: TMessage;
  lastItem: boolean;
  session: Session;
};

export const MessageItem = ({ message, lastItem, session }: Props) => {
  if (!session) return <></>;
  const isUser = session.user?.email === message.email;

  return (
    <div
      className={`flex items-center gap-2 ${
        isUser ? `justify-end` : `justify-start`
      }`}
    >
      <Image
        src={message.profilePic}
        alt={`${message.username}'s profile picture`}
        width={8}
        height={8}
        className={`h-5 w-5 rounded-full ${isUser ? `order-2` : `order-1`} ${
          lastItem ? `block` : `hidden`
        }`}
      />
      <div
        className={`flex flex-col gap-2 ${
          isUser ? `items-end` : `order-2 items-start`
        }`}
      >
        <p className="text-sm">{message.username}</p>
        <p
          className={`whitespace-normal break-all rounded-2xl ${
            isUser ? `bg-fb-blue` : `bg-slate-500`
          } py-3 px-4`}
        >
          {message.message}
        </p>
        <p className="text-xs text-gray-200">
          {new Date(message.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
