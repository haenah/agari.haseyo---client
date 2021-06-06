export interface Position {
  x: number;
  y: number;
}

export interface User {
  /** uuid */ id: string;
  username: string;
  position: Position;
  radius: number;
  color: string;
}

export interface Prey {
  /** uuid */ id: string;
  position: Position;
  radius: number;
  color: string;
}
