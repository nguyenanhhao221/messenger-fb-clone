import cuid from 'cuid';
import { client } from '../redis';
import { z } from 'zod';

export const TypeUser = z.object({
  id: z.string().cuid().min(1),
  email: z.string().email().min(1),
  image: z.string(),
  name: z.string().min(1),
});

/**
 * get these params from the user session with facebook login
 * @param userEmail {string}
 * @param userFullName {string}
 * @param imageLink {string}
 * @returns the info generated store in our own redis database
 */

export const getUserInfo = async (
  userEmail: string,
  userFullName: string,
  imageLink: string
) => {
  const randomId = cuid();
  const userInfo = {
    id: randomId,
    email: userEmail,
    name: userFullName,
    image: imageLink,
  };
  await client.setnx(`email:${userEmail}`, JSON.stringify(userInfo));
  const info = await client.get(`email:${userEmail}`);
  if (!info) return null;
  return TypeUser.parse(JSON.parse(info));
};
