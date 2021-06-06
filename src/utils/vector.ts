import { Position } from '../types/common.types';

export function distance({ x: ax, y: ay }: Position, { x: bx, y: by }: Position): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export function abs({ x, y }: Position) {
  return Math.sqrt(x ** 2 + y ** 2);
}

export function multiply({ x, y }: Position, scale: number) {
  return {
    x: scale * x,
    y: scale * y,
  };
}

export function linearComb(
  { x: ax, y: ay }: Position,
  c1: number,
  { x: bx, y: by }: Position,
  c2: number
) {
  return {
    x: ax * c1 + bx * c2,
    y: ay * c1 + by * c2,
  };
}

export function plus(a: Position, b: Position) {
  return linearComb(a, 1, b, 1);
}

export function minus(a: Position, b: Position) {
  return linearComb(a, 1, b, -1);
}
