import { logEvent } from 'firebase/analytics';
import hiragana from '../content/hiragana.json';
import katakana from '../content/katakana.json';
import { ErrorSnackbar } from './components/error-snackbar';
import { NumberInput } from './components/number-input';
import { ResultsPanel } from './components/results-panel';
import { TextToggle } from './components/text-toggle';
import { analytics } from './firebase';
import { Game } from './game/game';
import { GameCompleteEvent } from './game/game-complete.event';
import { InitialMessage } from './game/initial-message';
import { isMobile } from './globals';
import { KanaPanel } from './params/kana-panel';
import { ParameterSelector } from './params/parameter-selector';

const LS_KEY = 'params';

customElements.define('number-input', NumberInput);
customElements.define('text-toggle', TextToggle);
customElements.define('kana-panel', KanaPanel);
customElements.define('kana-game', Game);
customElements.define('game-initial-message', InitialMessage);
customElements.define('error-snackbar', ErrorSnackbar);
customElements.define('results-panel', ResultsPanel);

const parameters = new ParameterSelector();
const game = document.querySelector('#game') as Game;
const error = document.querySelector('#error') as ErrorSnackbar;
const result = document.querySelector('#results') as ResultsPanel;

const saved = window.localStorage.getItem(LS_KEY);

if (isMobile) document.body.classList.add('mobile');

Promise.all(([hiragana, katakana] as any[]).map(e => fetch(e)))
	.then(responses => Promise.all(responses.filter(e => e.ok).map(e => e.json())))
	.then(contents => parameters.setup(contents, saved))
	.catch(console.error);

document.querySelector('#start-button')?.addEventListener('click', tryStartGame);

function tryStartGame() {
	if (!parameters.canStart) {
		error.show('Select at least two characters');
		return;
	}

	const data = parameters.data;
	error.hide();
	game.start(data);
	game.addEventListener('complete', onGameComplete);
	window.localStorage.setItem(LS_KEY, JSON.stringify(data));
	logEvent(analytics, 'level_start');
}

function onGameComplete(e: Event) {
	const ev = e as GameCompleteEvent;
	if (ev.charCount > 0) result.show(ev.charCount, ev.totalTime);
}
