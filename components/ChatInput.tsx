'use client';
import cuid from 'cuid';
import React, { useState } from 'react';
import { ZodError } from 'zod';
import { z } from 'zod';
import useSWR from 'swr';
import { uploadMessageToUpStash } from '../utils/uploadMessageToUpStash';
import { fetchMessages } from '../utils/fetchMessages';
import type { TMessage } from '../type';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

//Type definition
export const TypeMessage = z.object({
  id: z.string().cuid(),
  message: z.string().min(1),
  createdAt: z.number(),
  username: z.string().min(1),
  profilePic: z.string().url(),
});

type Props = {
  session: Session;
};
export const ChatInput = ({ session }: Props) => {
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
  ): Promise<TMessage | undefined> => {
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
        username: session.user?.name,
        profilePic: session.user?.image,
        email: session.user?.email,
      });
      // Validate the input on the front end first just in case, then send the message to the api/addMessage.
      // Because the api will response with the exact message with the createAt time modify to the server time, we will use this data to optimistically update the cache of all message first.
      // In the background, the server will actually perform the writing of this message to the Redis database, if something go wrong. When the component refetch the api/getMessages in will rollback to previous
      await uploadMessageToUpStash(message);
      if (messagesData) {
        mutate(
          { ...messagesData, result: [...messagesData.result, message] },
          { rollbackOnError: true }
        );
      }
      return;
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

  if (error) return <div>Something wrong: {error}</div>;

  return (
    <form
      className="fixed bottom-0 left-0 right-0 z-50 flex w-full gap-4 bg-black p-4"
      onSubmit={(e) => handleSubmit(e)}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter Message..."
        className="w-full max-w-[100vw] rounded-2xl bg-black text-white"
      ></input>
      <button
        disabled={!input || input.length <= 0}
        type="submit"
        className="rounded-md p-2 hover:bg-opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
        title="Send Message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8 fill-fb-blue stroke-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </button>
    </form>
  );
};
