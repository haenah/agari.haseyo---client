import { MY_SIZE } from './constants';
import { Game } from './game';
import { canvas, clear, ctx, drawCircle, getClientCenter } from './utils/canvas';
import { linearComb, minus } from './utils/vector';

export class Renderer {
  constructor(private game: Game) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  private isRendering = false;
  render() {
    if (this.isRendering) return;
    this.isRendering = true;
    requestAnimationFrame(this._render);
  }

  private _render = () => {
    const {
      game: { users, me, preys },
    } = this;
    if (!me) return;
    const { position: mePosition, radius: meRadius, color: meColor, id: meId } = me;
    const scale = MY_SIZE / meRadius,
      offset = linearComb(getClientCenter(), 1, mePosition, -scale);
    ctx.resetTransform();
    clear();
    ctx.transform(scale, 0, 0, scale, offset.x, offset.y);
    preys.forEach(({ position, radius, color }) => drawCircle(position, radius, color));
    users.forEach(
      ({ id, position, radius, color }) => meId !== id && drawCircle(position, radius, color)
    );
    drawCircle(mePosition, meRadius, meColor);
    this.isRendering = false;
  };
}

export default Renderer;
