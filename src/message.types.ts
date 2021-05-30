import { Position } from './types/common.types';

// Outgoing Message
export const POSITION_CHANGED = 'POSITION_CHANGED';
export const MERGE = 'MERGE';
export const EAT = 'EAT';
// Incoming Message
export const JOIN = 'JOIN';
export const OBJECTS = 'OBJECTS';
export const MERGED = 'MERGED';
export const WAS_MERGED = 'WAS_MERGED';
export const EATED = 'EATED';
export const SEED = 'SEED';

interface PositionChangedMessage {
  type: typeof POSITION_CHANGED;
  body: {
    position: Position[];
  };
}
