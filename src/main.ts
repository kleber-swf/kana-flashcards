import hiragana from '../content/hiragana.json';
import katakana from '../content/katakana.json';
import { ErrorSnackbar } from './components/error-snackbar';
import { NumberInput } from './components/number-input';
import { TextToggle } from './components/text-toggle';
import { Game } from './game/game';
import { KanaPanel } from './params/kana-panel';
import { ParameterSelector } from './params/parameter-selector';

customElements.define('number-input', NumberInput);
customElements.define('text-toggle', TextToggle);
customElements.define('kana-panel', KanaPanel);
customElements.define('kana-game', Game);
customElements.define('error-snackbar', ErrorSnackbar);

const parameters = new ParameterSelector();
const game = document.querySelector('#game') as Game;
const error = document.querySelector('#error') as ErrorSnackbar;

Promise.all(([hiragana, katakana] as any[]).map(e => fetch(e)))
	.then(responses => Promise.all(responses.filter(e => e.ok).map(e => e.json())))
	.then(contents => parameters.setup(contents))
	.catch(console.error);

document.querySelector('#start-button')?.addEventListener('click', () => {
	if (!parameters.canStart) {
		error.show('Select at least two characters');
		return;
	}
	error.hide();
	game.start(parameters.data);
});
