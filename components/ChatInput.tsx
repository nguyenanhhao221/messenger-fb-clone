'use client';
import cuid from 'cuid';
import React, { useState } from 'react';
import { ZodError } from 'zod';
import type { z } from 'zod';
import { TypeMessage } from '../types';

export const ChatInput = () => {
  const [input, setInput] = useState<string>('');

  const uploadMessageToUpstash = async (
    message: z.infer<typeof TypeMessage>
  ) => {
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
  };
  /**
   * Send message handler.Check if the message is valid, if yes then make POST request to API end point
   * @param {string} e input value
   * @returns
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    const messageToSend = input;
    // if message is validate correct types go ahead make request to api endpoint
    // other wise throw error
    try {
      const message = TypeMessage.parse({
        id: cuid(),
        message: messageToSend,
        createAt: Date.now(),
        username: 'Tim Apple',
        profilePic: 'https://unsplash.com/photos/6anudmpILw4',
      });
      setInput('');
    } catch (e) {
      if (e instanceof ZodError) {
        console.error(e.issues);
      }
    }
  };
  const;

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
