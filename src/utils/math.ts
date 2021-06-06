import { Position } from '../types/common.types';

export function distance({ x: ax, y: ay }: Position, { x: bx, y: by }: Position): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export function abs({ x, y }: Position) {
  return Math.sqrt(x ** 2 + y ** 2);
}
