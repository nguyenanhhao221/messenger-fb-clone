import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { client } from '../../redis';
import type { TMessage } from '../../type';
import { authOptions } from './auth/[...nextauth]';

type ErrorData = {
  body: string;
};
type ResponseData = {
  result: TMessage[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorData>
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session)
    return res
      .status(401)
      .json({ body: 'You are not authorized, please log in' });

  if (req.method !== 'GET') {
    res.status(405).json({ body: 'Method not allow' });
    return;
  }
  //   TODO Implement session before load message
  //   Make request to get Message from UpStash
  try {
    const messageArrResponse: TMessage[] = (await client.hvals('message')).map(
      (message) => JSON.parse(message)
    );
    if (messageArrResponse) {
      const messageResponse: TMessage[] = messageArrResponse.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      res.status(200).json({ result: messageResponse });
      return messageArrResponse;
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error, check console for more detail');
  }
}
