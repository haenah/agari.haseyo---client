import { init } from './init';
import $ from 'jquery';

export const canvas = $('#game').get(0) as HTMLCanvasElement;
const _ctx = canvas.getContext('2d');
if (_ctx == null) {
  throw new Error('canvas_not_compatible');
}
export const ctx = _ctx;

try {
  init();
} catch (error) {
  console.error(error);
}
