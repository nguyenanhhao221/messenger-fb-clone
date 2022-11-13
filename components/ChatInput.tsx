'use client';
import cuid from 'cuid';
import React, { useState } from 'react';
import { ZodError } from 'zod';
import { z } from 'zod';

export const TypeMessage = z.object({
  id: z.string().cuid(),
  message: z.string().min(1),
  createdAt: z.number(),
  username: z.string().min(1),
  profilePic: z.string().url(),
});

/**
 * @async
 * @function uploadMessageToUpStash
 * @param {z.infer<typeof TypeMessage>} message - The message object to be sent to the API
 * @returns The success status from the api
 */
const uploadMessageToUpStash = async (
  message: z.infer<typeof TypeMessage>
): Promise<{ data: number }> => {
  const res = await fetch('/api/addMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (res.ok) {
    const jsonResponse = await res.json();
    return jsonResponse;
  }
  throw new Error('Network Error');
};

export const ChatInput = () => {
  const [input, setInput] = useState<string>('');
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
        profilePic: 'https://unsplash.com/photos/6anudmpILw4',
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
