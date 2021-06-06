import $ from 'jquery';
import { canvas, ctx } from '.';
import { BOARD_HEIGHT, BOARD_WIDTH } from './constants';
import { Game } from './game';
import { Position } from './types/common.types';

export class Renderer {
  constructor(private game: Game) {
    canvas.width = BOARD_WIDTH;
    canvas.height = BOARD_HEIGHT;
  }

  private isRendering = false;
  render() {
    if (this.isRendering) return;
    this.isRendering = true;
    requestAnimationFrame(this._render);
  }

  private _render = () => {
    const {
      drawCircle,
      clear,
      game: { users, preys },
    } = this;
    clear();
    preys.forEach(({ position, radius, color }) => drawCircle(position, radius, color));
    users.forEach(({ position, radius, color }) => drawCircle(position, radius, color));
    this.isRendering = false;
  };

  drawCircle = ({ x, y }: Position, r: number, color?: string) => {
    ctx.fillStyle = color || 'black';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 360);
    ctx.fill();
  };

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

export default Renderer;
