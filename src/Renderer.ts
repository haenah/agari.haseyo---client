import { MY_SIZE } from './constants';
import { Game } from './game';
import { canvas, ctx, drawCircle, getClientCenter } from './utils/canvas';
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
      clear,
      game: { users, me, preys },
    } = this;
    if (!me) return;
    clear();
    const { position: mePosition, radius: meRadius, color: meColor, id: meId } = me;
    const scale = MY_SIZE / meRadius,
      clientCenter = getClientCenter();
    preys.forEach(({ position, radius, color }) =>
      drawCircle(
        linearComb(minus(position, mePosition), scale, clientCenter, 1),
        radius * scale,
        color
      )
    );
    users.forEach(
      ({ id, position, radius, color }) =>
        meId !== id &&
        drawCircle(
          linearComb(minus(position, mePosition), scale, clientCenter, 1),
          radius * scale,
          color
        )
    );
    drawCircle(clientCenter, MY_SIZE, meColor);
    this.isRendering = false;
  };

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

export default Renderer;
