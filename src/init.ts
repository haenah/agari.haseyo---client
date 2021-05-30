import $ from 'jquery';
import { Game } from './game';
import { getFormValues } from './utils/form';

function resolveCanvasContext() {
  const canvas = $('#game').get(0) as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (context == null) throw new Error('canvas_not_compatible');
  window._mainContext = context;
}

function hydrateForm() {
  $('#enter-game').on('submit', function (e) {
    e.preventDefault();
    const formValues = getFormValues<{ username: string }>(this as HTMLFormElement);
    const game = new Game(formValues.username, console.log);
    game.start();
    $('#home-wrapper').remove();
  });
}

export function init() {
  resolveCanvasContext();
  hydrateForm();
}
