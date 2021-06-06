import { Position } from '../types/common.types';
import $ from 'jquery';

export const canvas = $('#game').get(0) as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const _ctx = canvas.getContext('2d');
if (_ctx == null) {
  throw new Error('canvas_not_compatible');
}
export const ctx = _ctx;

export function drawCircle({ x, y }: Position, r: number, color?: string) {
  ctx.fillStyle = color || 'black';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 360);
  ctx.fill();
}

export function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function getClientCenter(): Position {
  return {
    x: canvas.clientWidth / 2,
    y: canvas.clientHeight / 2,
  };
}

export function resizeCanvasHandler() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
