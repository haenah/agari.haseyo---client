import { MY_SIZE } from './constants';
import { Game } from './game';
import { clear, ctx, drawCircle, getClientCenter } from './utils/canvas';

export class Renderer {
  constructor(private game: Game) {}

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
      clientCenter = getClientCenter();
    ctx.resetTransform();
    clear();
    // 원점을 캔버스 중앙으로
    ctx.translate(clientCenter.x, clientCenter.y);
    // 스케일링
    ctx.scale(scale, scale);
    // 자신의 위치를 원점으로
    ctx.translate(-mePosition.x, -mePosition.y);
    preys.forEach(({ position, radius, color }) => drawCircle(position, radius, color));
    users.forEach(
      ({ id, position, radius, color }) => meId !== id && drawCircle(position, radius, color)
    );
    drawCircle(mePosition, meRadius, meColor);
    this.isRendering = false;
  };
}

export default Renderer;
