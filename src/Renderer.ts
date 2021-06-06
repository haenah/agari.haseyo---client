import $ from 'jquery';
import { Game } from './game';
import { Position } from './types/common.types';

export class _Renderer {
  constructor() {
    this.canvas = $('#game').get(0) as HTMLCanvasElement;
    this.canvas.width = 1000;
    this.canvas.height = 1000;
    const context = this.canvas.getContext('2d');
    if (context == null) {
      throw new Error('context_not_exist');
    } else {
      this.ctx = context;
    }
  }

  /** Rendering context */
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  // TODO: requestAnimationFrame 이용하여 로드 분산
  render({ users, preys }: Game) {
    const { drawCircle, clear } = this;
    clear();
    users.forEach(({ position, radius }) => drawCircle(position, radius));
    preys.forEach(({ position, radius }) => drawCircle(position, radius));
  }

  drawCircle = ({ x, y }: Position, r: number) => {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 360);
    ctx.stroke();
  };

  clear = () => {
    const { canvas, ctx } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

const Renderer = new _Renderer();
export default Renderer;
