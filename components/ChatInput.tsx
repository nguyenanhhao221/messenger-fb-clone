'use client';
import cuid from 'cuid';
import React, { useState } from 'react';
import { ZodError } from 'zod';
import { z } from 'zod';
import useSWR from 'swr';
import { uploadMessageToUpStash } from '../utils/uploadMessageToUpStash';
import { fetchMessages } from '../utils/fetchMessages';
import type { TMessage } from '../type';

//Type definition
export const TypeMessage = z.object({
  id: z.string().cuid(),
  message: z.string().min(1),
  createdAt: z.number(),
  username: z.string().min(1),
  profilePic: z.string().url(),
});

export const ChatInput = () => {
  const [input, setInput] = useState<string>('');
  const {
    data: messagesData,
    error,
    mutate,
  } = useSWR<{ result: TMessage[] }>('/api/getMessages', fetchMessages);

  /**
   * Send message handler.Check if the message is valid, if yes then make POST request to API end point
   * @param {string} e input value
   * @returns
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<number | undefined> => {
    e.preventDefault();
    if (!input) return;

    const messageToSend = input;
    // if message is validate correct types go ahead make request to api endpoint
    // other wise throw error
    try {
      setInput('');
      const message = TypeMessage.parse({
        id: cuid(),
        message: messageToSend,
        createdAt: Date.now(),
        username: 'Tim Apple',
        profilePic:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      });
      const res = await uploadMessageToUpStash(message);
      if (res) return res.data;
    } catch (e) {
      if (e instanceof ZodError) {
        console.error(e.issues);
      }
      if (e instanceof Error) {
        console.error(e.message);
        throw new Error(e.message);
      }
      console.error(e);
      throw new Error('Check console for error');
    }
  };

  return (
    <form
      className="fixed bottom-0 left-0 right-0 z-50 flex w-full gap-4 p-4"
      onSubmit={(e) => handleSubmit(e)}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter Message..."
        className="w-full rounded-md text-black"
      ></input>
      <button
        disabled={!input || input.length <= 0}
        type="submit"
        className="rounded-md bg-fb-blue p-2 hover:bg-opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
};
