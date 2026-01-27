import { logEvent } from 'firebase/analytics';
import { ErrorSnackbar } from './components/error-snackbar';
import { NumberInput } from './components/number-input';
import { ResultsPanel } from './components/results-panel';
import { TextToggle } from './components/text-toggle';
import { analytics } from './firebase';
import { GameView } from './game/game.view';
import { GameCompleteEvent } from './game-old/game-complete.event';
import { InitialMessage } from './game-old/initial-message';
import { isMobile } from './globals';
import { KanaPanel } from './params/kana-panel';
import { ContentProvider } from './core/content-provider';
import { CardFaceView } from './game/card/card-face.view';
import { CardView } from './game/card/card-view';

// const LS_KEY = 'params';
// check
customElements.define('number-input', NumberInput);
customElements.define('text-toggle', TextToggle);

// check
customElements.define('game-initial-message', InitialMessage);
customElements.define('error-snackbar', ErrorSnackbar);
customElements.define('results-panel', ResultsPanel);

customElements.define('kana-panel', KanaPanel);
customElements.define('kana-game', GameView);
customElements.define('kana-card', CardView);
customElements.define('card-face', CardFaceView);

// const parameters = new ParameterSelector();
const game = document.querySelector('#game') as GameView;
const error = document.querySelector('#error') as ErrorSnackbar;
const result = document.querySelector('#results') as ResultsPanel;

// const saved = window.localStorage.getItem(LS_KEY);

if (isMobile) document.body.classList.add('mobile');

document.querySelector('#start-button')?.addEventListener('click', startGame);
game.addEventListener('complete', onGameComplete);

function startGame() {
	ContentProvider.getContent()
		.then(content => {
			error.hide();
			game.start(content);
			logEvent(analytics, 'level_start'); // TODO move this to game
		});
	// const data = parameters.data;
	// game.start(data);
	// window.localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function onGameComplete(e: Event) {
	const ev = e as GameCompleteEvent;
	if (ev.charCount > 0) result.show(ev.charCount, ev.totalTime);
}
