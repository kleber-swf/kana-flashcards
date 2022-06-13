import { hiragana } from './content';
import { Game } from './game';

const game = new Game();
game.start([hiragana], ['reads', 'tip', 'writes']);
