import hiragana from '../content/hiragana.json';
import { showError } from './error';
import { Game } from './game/game';
import { NumberInput } from './number-input';
import { ParameterSelector } from './params/parameter-selector';

const parameters = new ParameterSelector();
const game = new Game();


customElements.define('number-input', NumberInput);

document.querySelector('#start-button')!
	.addEventListener('click', () => {
		if (parameters.canStart) game.show(parameters.data);
		else showError('Select at least two characters');
	});

Promise.all(([hiragana] as any[]).map(e => fetch(e)))
	.then(responses => Promise.all(responses.filter(e => e.ok).map(e => e.json())))
	.then(contents => parameters.setup(contents))
	.catch(console.error);
