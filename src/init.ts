import $ from 'jquery';
import { Game } from './game';
import { getFormValues } from './utils/form';

export function init() {
  $('#enter-game').on('submit', function (e) {
    e.preventDefault();
    const formValues = getFormValues<{ username: string }>(this as HTMLFormElement);
    const game = new Game(formValues.username, console.log);
    game.start();
    $('#home-wrapper').remove();
  });
}
