import hiragana from '../content/hiragana.json';
import { showError } from './error';
import { Game } from './game';
import { KanaModel } from './model';
import { ParameterSelector } from './parameter-selector';

const parameters = new ParameterSelector();
const game = new Game();

document.querySelector('#start-button')!
	.addEventListener('click', () => {
		if (parameters.canStart) game.start(parameters.data, ['reads', 'tip', 'writes']);
		else showError('Select at least two characters');
	});

Promise.all(([hiragana] as any[]).map(e => fetch(e)))
	.then(responses => Promise.all(responses.filter(e => e.ok).map(e => e.json())))
	.then(contents => parameters.setup(document.querySelector('#parameters')!, contents))
	.catch(console.error);
