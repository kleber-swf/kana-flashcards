import { CharacterGroupModel, CharacterModel, Elements, GameElements, KanaModel } from './model';

export class Game {
	private readonly game: HTMLElement;
	private readonly elements: GameElements;

	private chars: CharacterModel[];
	private selectedCharIndex: number;
	private selectedChar: CharacterModel;

	private revealOrder: Elements[];
	private revealIndex: number;

	constructor() {
		this.game = document.querySelector('#game')!,
			this.elements = {
				reads: this.game.querySelector('#reads')!,
				writes: this.game.querySelector('#writes')!,
				tip: this.game.querySelector('#tip')!,
			};

		document.addEventListener('keydown', this.onKeyDown.bind(this))
	}

	public start(kanas: KanaModel[], revealOrder: Elements[]) {
		kanas.map(k => k.groups).flat().map(g => g.characters).flat().filter(c => c && !c.hidden);
		this.revealOrder = revealOrder;
		this.selectedCharIndex = -1;
		this.nextChar();
	}

	private nextChar() {
		this.revealIndex = -1;
		let i: number;
		do i = Math.floor(Math.random() * this.chars.length);
		while (i === this.selectedCharIndex);
		this.selectedCharIndex = i;
		this.selectedChar = this.chars[i];

		Object.keys(this.elements)
			.forEach(k => {
				const e = this.elements[k];
				e.classList.add('invisible');
				e.innerText = this.selectedChar[k];
			});
	}

	private reveal(el: Elements) {
		this.elements[el].classList.remove('invisible');
	}

	private onKeyDown(e: KeyboardEvent) {
		if (e.code !== 'Space') return;
		e.preventDefault();
		e.stopPropagation();

		this.revealIndex++;
		if (this.revealIndex < this.revealOrder.length) {
			this.reveal(this.revealOrder[this.revealIndex]);
		} else {
			this.nextChar();
		}
	}
}