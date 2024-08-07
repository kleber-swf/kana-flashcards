import { CharacterModel, Elements, GameElements, KanaModel } from './model';

const PLAYING_CLASS = 'playing';
const INVISIBLE_CLASS = 'invisible';
const PLAY_ANIM_DURATION = 1000;

export class Game {
	private readonly game: HTMLElement;
	private readonly elements: GameElements;

	private chars: CharacterModel[];
	private selectedCharIndex: number;
	private selectedChar: CharacterModel;

	private revealOrder: Elements[];
	private revealIndex: number;

	private playing = false;

	constructor() {
		this.game = document.querySelector('#game')!;
		this.elements = {
			reads: this.game.querySelector('#reads')!,
			writes: this.game.querySelector('#writes')!,
			tip: this.game.querySelector('#tip')!,
		};

		document.addEventListener('keydown', this.onKeyDown.bind(this))
	}

	public start(kanas: KanaModel[], revealOrder: Elements[]) {
		this.chars = kanas.map(k => k.groups).flat().map(g => g.characters).flat().filter(c => c && !c.hidden);
		this.revealOrder = revealOrder;
		this.selectedCharIndex = -1;
		this.game.classList.add(PLAYING_CLASS);
		setTimeout(() => this.playing = true, PLAY_ANIM_DURATION);
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
				e.classList.add(INVISIBLE_CLASS);
				e.innerText = this.selectedChar[k];
			});
	}

	private reveal(el: Elements) {
		this.elements[el].classList.remove(INVISIBLE_CLASS);
	}

	private onKeyDown(e: KeyboardEvent) {
		if (!this.playing) return;
		if (e.code === 'Space') this.advance();
		else if (e.code === 'Escape') this.exit();
		else return;

		e.preventDefault();
		e.stopPropagation();
	}

	private advance() {
		this.revealIndex++;
		if (this.revealIndex < this.revealOrder.length) {
			this.reveal(this.revealOrder[this.revealIndex]);
		} else {
			this.nextChar();
		}
	}

	private exit() {
		this.playing = false;
		this.game.classList.remove(PLAYING_CLASS);
	}
}