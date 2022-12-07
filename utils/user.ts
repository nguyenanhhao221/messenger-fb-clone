import cuid from 'cuid';
import { client } from '../redis/redis';
import { z } from 'zod';

export const TypeUser = z.object({
  id: z.string().cuid().min(1),
  email: z.string().email().min(1),
  image: z.string(),
  name: z.string().min(1),
});

const createNewUser = async (userInfo: z.infer<typeof TypeUser>) => {
  const userId = cuid();
  return Promise.all([
    await client.hset('allUsers', userId, JSON.stringify(userInfo)),
    await client.set(`email:${userInfo.email}`, JSON.stringify(userInfo)),
  ]);
};

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
  //Check if user already exist in our database
  const isUserExist = await client.get(`email:${userEmail}`);
  if (isUserExist) {
    return TypeUser.parse(JSON.parse(isUserExist));
  }
  await createNewUser(userInfo);
  const newUser = await client.get(`email:${userEmail}`);
  if (newUser) return TypeUser.parse(JSON.parse(newUser));
};
