import { Position } from '../common.types';

export const POSITION_CHANGED = 'POSITION_CHANGED';
export const MERGE = 'MERGE';
export const EAT = 'EAT';

interface PositionChangedMessage {
  type: typeof POSITION_CHANGED;
  body: {
    position: Position;
  };
}

interface MergeMessage {
  type: typeof MERGE;
  body: {
    colony_id: string;
  };
}

interface EatMessage {
  type: typeof EAT;
  body: {
    prey_id: string;
  };
}

export type OutgoingMessage = PositionChangedMessage | MergeMessage | EatMessage;
