import { CardModel } from '../../core/model/card-model';
import { RoundModel } from './round.model';

const MAX_ROUND_SIZE = 10;

export class RoundManager {
	private _content?: CardModel[];

	public set content(value: CardModel[]) { this._content = value; }

	public generateRound(): RoundModel[] {
		if (!this._content)
			throw Error('Set the content first');

		const cards = this._content;
		const count = Math.min(this._content.length, MAX_ROUND_SIZE);
		const result: RoundModel[] = [];
		const indexes: number[] = [];
		let index = -1;

		for (let i = 0; i < count; i++) {
			do index = Math.floor(Math.random() * cards.length);
			while (indexes.indexOf(index) >= 0);
			indexes.push(index);
			result.push({
				index,
				card: cards[index],
			});
		}

		return result;
	}

	public saveContent(content: CardModel[], round: RoundModel[]) {
		round.forEach(e => content[e.index] = e.card);
	}
}