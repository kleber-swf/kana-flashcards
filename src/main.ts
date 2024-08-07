import hiragana from '../content/hiragana.json';
import { NumberInput } from './components/number-input';
import { TextToggle } from './components/text-toggle';
import { ErrorHandler } from './error';
import { Game } from './game/game';
import { ParameterSelector } from './params/parameter-selector';

const parameters = new ParameterSelector();
const error = new ErrorHandler();
const game = new Game();

customElements.define('number-input', NumberInput);
customElements.define('text-toggle', TextToggle);

function tryStartGame() {
	if (!parameters.canStart) {
		error.show('Select at least two characters');
		return;
	}
	error.hide();
	game.show(parameters.data);
}

document.querySelector('#start-button')!.addEventListener('click', tryStartGame);

Promise.all(([hiragana] as any[]).map(e => fetch(e)))
	.then(responses => Promise.all(responses.filter(e => e.ok).map(e => e.json())))
	.then(contents => parameters.setup(contents))
	.catch(console.error);
