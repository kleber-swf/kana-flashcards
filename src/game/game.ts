import { CharacterModel, Elements, GameElements, Parameters } from '../model';

const PLAYING_CLASS = 'playing';
const INVISIBLE_CLASS = 'invisible';
const PLAY_ANIM_DURATION = 1000;
const ACTION_KEY = 'Space';
const EXIT_KEY = 'Escape';

export class Game {
	private readonly game: HTMLElement;
	private readonly elements: GameElements;
	private readonly initialMessage: HTMLElement;

	private chars: CharacterModel[];
	private selectedCharIndex: number;
	private selectedChar: CharacterModel;

	private revealOrder: Elements[];
	private revealIndex: number;

	private playing = false;
	private canAdvance = false;

	constructor() {
		this.game = document.querySelector('#game')!;
		this.initialMessage = document.querySelector('#initial-message')!;
		this.initialMessage.innerHTML = `<div>Press &lt;${ACTION_KEY}&gt; to start</div>` +
			`<div class="small">Press &lt;${ACTION_KEY}&gt; to advance or &lt;${EXIT_KEY}&gt; to exit.</div>`;

		this.elements = {
			reads: this.game.querySelector('#reads')!,
			writes: this.game.querySelector('#writes')!,
			tip: this.game.querySelector('#tip')!,
		};

		document.addEventListener('keydown', this.onKeyDown.bind(this));
	}

	public show(params: Parameters, revealOrder: Elements[]) {
		this.chars = params.kanas
			.map(k => k.groups).flat()
			.map(g => g.characters).flat()
			.filter(c => c && !c.hidden);

		this.revealOrder = revealOrder;
		this.selectedCharIndex = -1;
		this.game.classList.add(PLAYING_CLASS);

		this.nextChar();
		setTimeout(this.start.bind(this), PLAY_ANIM_DURATION);
	}

	private start() {
		this.initialMessage.classList.remove(INVISIBLE_CLASS);

		const doStart = (e: KeyboardEvent) => {
			if (e.code === ACTION_KEY) {
				this.playing = true;
				this.canAdvance = true;
				this.advance();
			} else if (e.code !== EXIT_KEY) return;
			this.initialMessage.classList.add(INVISIBLE_CLASS);
			document.removeEventListener('keydown', doStart);
		}

		document.addEventListener('keydown', doStart);
	}

	private advance() {
		if (!this.canAdvance) return;
		this.revealIndex++;
		if (this.revealIndex < this.revealOrder.length) {
			this.reveal(this.revealOrder[this.revealIndex]);
		} else {
			this.nextChar();
		}
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

	private exit() {
		this.playing = false;
		this.game.classList.remove(PLAYING_CLASS);
	}
}
