import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import { TypeMessage } from '../../components/ChatInput';
import { client } from '../../redis';

type ErrorData = {
  body: string;
};
type ResponseData = {
  data: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorData>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ body: 'Method not allow' });
    return;
  }
  //TODO implement better typing instead of "as"
  const { message } = req.body;
  try {
    const validateMessageInput = TypeMessage.parse(message);
    // *Replace the createAt time from the client with the time stamp on the server
    const newMessage = { ...validateMessageInput, createdAt: Date.now() };
    //push the message to UpStash
    const response = await client.hset(
      'message',
      newMessage.id,
      JSON.stringify(newMessage)
    );
    res.status(201).json({ data: response });
    return;
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
