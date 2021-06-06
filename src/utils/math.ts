import { Position } from '../types/common.types';

export function distance(
  { position: { x: ax, y: ay } }: { position: Position },
  { position: { x: bx, y: by } }: { position: Position }
): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}
