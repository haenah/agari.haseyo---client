import $ from 'jquery';
import { enterGame } from './game';

function resolveCanvasContext() {
  const canvas = $('#game').get(0) as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (context == null) throw new Error('canvas_not_compatible');
  window._mainContext = context;
}

function hydrateHome() {
  $('#enter-game').on('submit', (e) => {
    e.preventDefault();
    enterGame();
  });
}

export function init() {
  resolveCanvasContext();
  hydrateHome();
}
