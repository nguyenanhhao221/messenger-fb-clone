import type { z } from 'zod';
import type { TypeMessage } from './components/ChatInput';

export type TMessage = z.infer<typeof TypeMessage>;
