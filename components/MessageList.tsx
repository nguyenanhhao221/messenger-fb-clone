'use client';
import React from 'react';
import { fetchMessages } from '../utils/fetchMessages';
import useSWR from 'swr';
import { MessageItem } from './MessageItem';
import type { TMessage } from '../type';
import { Loader } from './Loader';

export const MessageList = () => {
  const { data: messagesData, error } = useSWR<{ result: TMessage[] }>(
    '/api/getMessages',
    fetchMessages
  );
  if (error) return <div>Something wrong: {error}</div>;
  if (!messagesData)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="px-4 pb-24">
      {messagesData?.result.map((message) => (
        <div key={message.id}>
          <MessageItem message={message} />
        </div>
      ))}
    </div>
  );
};
