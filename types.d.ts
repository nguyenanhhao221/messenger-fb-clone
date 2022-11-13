import { string, z } from 'zod';

export const TypeMessage = z.object({
  id: z.string().cuid(),
  message: z.string().min(1),
  createAt: z.date(),
  username: z.string().min(1),
  profilePic: z.string().url(),
});
