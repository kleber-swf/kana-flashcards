import { ContentSelector } from './content-selector';
import hiragana from '../content/hiragana.json';

const contents: any[] = [hiragana];
const selector = new ContentSelector();

Promise.all(contents.map(e => fetch(e)))
	.then(responses => Promise.all(responses.map(e => e.json())))
	.then(contents => {
		selector.setup(document.querySelector('#selector')!, contents);
	})
	.catch(console.error);



// const game = new Game();
// game.start([hiragana], ['reads', 'tip', 'writes']);