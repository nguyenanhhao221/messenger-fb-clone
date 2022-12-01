import type { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodError } from 'zod';
import { serverPusher } from '../../../../pusher/serverPusher';
import { client } from '../../../../redis';
import type { TMessage } from '../../../../type';

type ErrorData = {
  body: string;
};

export const TypeMessage = z.object({
  id: z.string().cuid(),
  message: z.string().min(1),
  createdAt: z.number(),
  username: z.string().min(1),
  profilePic: z.string().url(),
  email: z.string().email(),
  roomId: z.string().cuid().min(1),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TMessage | ErrorData>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ body: 'Method not allow' });
    return;
  }
  const { message } = req.body;
  const roomId = req.query.roomId;
  try {
    //Validate input again in the backend because you can never trust the front end :D
    const validateMessageInput = TypeMessage.parse(message);
    // * Replace the createAt time from the client with the time stamp on the server
    const newMessageUpdateTime = {
      ...validateMessageInput,
      createdAt: Date.now(),
    };
    // if the input is valid and new time is created, send back to the client this message first.
    // Then actually perform write operation to the redis database to post the message.
    if (newMessageUpdateTime) {
      res.status(201).json(newMessageUpdateTime);
    }
    //push the message to UpStash
    const addNewMessage = await client.hset(
      `room:${roomId}:messages`,
      newMessageUpdateTime.id,
      JSON.stringify(newMessageUpdateTime)
    );
    if (!addNewMessage) {
      res.status(500).json({ body: 'Cannot create message on the server' });
      return;
    }

    //Push the message to Pusher so all the clients can subscribe to it
    return serverPusher.trigger('message', 'new-message', newMessageUpdateTime);
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      error.issues.map((e) => {
        throw new Error(e.message);
      });
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error, check console ');
  }
}
