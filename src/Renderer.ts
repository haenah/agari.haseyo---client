import $ from 'jquery';
import { Game } from './game';

export class _Renderer {
  private context = ($('#game').get(0) as HTMLCanvasElement).getContext('2d');
  render(game: Game) {
    const { context } = this;
  }
}

const Renderer = new _Renderer();
export default Renderer;
