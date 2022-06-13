import { ParameterSelector } from './parameter-selector';
import hiragana from '../content/hiragana.json';
import { Game } from './game';
import { KanaModel } from './model';

let content: KanaModel[];
const parameters = new ParameterSelector();
const game = new Game();

function getContentUrls() { return [hiragana] as any[]; }

Promise.all(getContentUrls().map(e => fetch(e)))
	.then(responses => Promise.all(responses.map(e => e.json())))
	.then(jsons => {
		content = jsons;
		parameters.setup(document.querySelector('#selector')!, jsons);
	})
	.catch(console.error);

document.querySelector('#start-button')?.addEventListener('click', () => {
	game.start(content, ['reads', 'tip', 'writes']);
});
