import type { z } from 'zod';
import type { TypeMessage } from './components/ChatInput';

export type TMessage = z.infer<typeof TypeMessage>;

export type TUser = {
  id: string;
  name: string;
  image: string;
};

export const formatChatRoomMessage = (arrOfMessageData: []) => {};
