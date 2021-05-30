import { Prey, User } from '../model.types';

export const JOIN = 'JOIN';
export const OBJECTS = 'OBJECTS';
export const MERGED = 'MERGED';
export const WAS_MERGED = 'WAS_MERGED';
export const EATED = 'EATED';
export const SEED = 'SEED';

interface JoinMessage {
  type: typeof JOIN;
  body: {
    new_user: User;
  };
}

interface ObjectsMessage {
  type: typeof OBJECTS;
  body: {
    users: User[];
    preys: Prey[];
  };
}

interface MergedMessage {
  type: typeof JOIN;
  body: {
    user_after_merge: User;
    colony_id: string;
  };
}

interface WasMergedMessage {
  type: typeof JOIN;
  body: {};
}

interface EatedMessage {
  type: typeof JOIN;
  body: {
    user_after_eat: User;
    prey_id: string;
  };
}

interface SeedMessage {
  type: typeof JOIN;
  body: {
    new_preys: Prey[];
  };
}

export type IncomingMessage =
  | JoinMessage
  | ObjectsMessage
  | MergedMessage
  | WasMergedMessage
  | EatedMessage
  | SeedMessage;
