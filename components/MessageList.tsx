'use client';
import React, { useEffect, useRef } from 'react';
import { fetchMessages } from '../utils/fetchMessages';
import useSWR from 'swr';
import { MessageItem } from './MessageItem';
import type { TMessage } from '../type';
import { Loader } from './Loader';

export const MessageList = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: messagesData, error } = useSWR<{ result: TMessage[] }>(
    '/api/getMessages',
    fetchMessages
  );
  //  This will be used as a placeholder so that every time new message comes in, we will scroll to this div to make sure that we can see th latest message, otherwise user have to manually scroll down
  useEffect(() => {
    return bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  if (error) return <div>Something wrong: {error}</div>;
  if (!messagesData)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 pb-32 xl:max-w-4xl">
      {messagesData?.result.map((message) => (
        <div key={message.id}>
          <MessageItem message={message} />
        </div>
      ))}
      <div ref={bottomRef} className="bottom-div"></div>
    </div>
  );
};
