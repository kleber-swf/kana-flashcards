import { CardView } from './card/card-view';
import { RoundModel } from './round/round.model';

const PLAYING_CLASS = 'playing';

export class Game extends HTMLElement {
	private readonly card: CardView;

	constructor() {
		super();
		this.card = this.querySelector('#card') as CardView;
	}

	public start(content: RoundModel[]) {
		this.classList.add(PLAYING_CLASS);
		this.card.model = content[0].card;
	}
}