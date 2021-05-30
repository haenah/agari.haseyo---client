import { IncomingMessage } from './incomingMessage.types';
import { OutgoingMessage } from './outgoingMessage.types';

export type Message = IncomingMessage | OutgoingMessage;
export { IncomingMessage, OutgoingMessage };
