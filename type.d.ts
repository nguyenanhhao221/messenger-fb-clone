import type { z } from 'zod';
import type { TypeMessage } from './components/ChatInput';
import type { TypeRoom } from './utils/chatRoom';
import type { TypeUser } from './utils/user';

export type TMessage = z.infer<typeof TypeMessage>;

export type TRoom = z.infer<typeof TypeRoom>;

export type TUser = z.infer<typeof TypeUser>;
