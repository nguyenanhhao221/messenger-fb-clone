import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { client } from '../../../../redis';
import type { TMessage } from '../../../../type';
import { authOptions } from '../../auth/[...nextauth]';

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TMessage[] | ErrorData>
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
  const roomId = req.query.roomId;
  if (!roomId)
    return res.status(404).json({ body: 'Room Id is not valid in URL' });

  //   Make request to get Message from UpStash
  try {
    const messageArrResponse: TMessage[] = (
      await client.hvals(`room:${roomId}:messages`)
    ).map((message) => JSON.parse(message));
    if (messageArrResponse) {
      const messageResponse = messageArrResponse.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      return res.status(200).json(messageResponse);
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unknown error, check console for more detail');
  }
}
