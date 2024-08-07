import hiragana from '../content/hiragana.json';
import { NumberInput } from './components/number-input';
import { TextToggle } from './components/text-toggle';
import { ErrorHandler } from './error';
import { AnotherGame } from './game/another.game';
import { Game } from './game/game';
import { ParameterSelector } from './params/parameter-selector';

customElements.define('number-input', NumberInput);
customElements.define('text-toggle', TextToggle);
customElements.define('kana-game', AnotherGame);

const parameters = new ParameterSelector();
const error = new ErrorHandler();
const game = new Game();


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
	.then(contents => {
		parameters.setup(contents);

		(document.querySelector('#another-game') as AnotherGame)
			.start(parameters.data);
	})
	.catch(console.error);
