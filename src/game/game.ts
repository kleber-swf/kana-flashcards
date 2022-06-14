import { CharacterModel, Elements, GameElements, Parameters } from '../model';
import { TimeController } from './time.controller';

const PLAYING_CLASS = 'playing';
const INVISIBLE_CLASS = 'invisible';
const PLAY_ANIM_DURATION = 500;
const ACTION_KEY = 'Space';
const EXIT_KEY = 'Escape';

export class Game {
	private readonly game: HTMLElement;
	private readonly elements: GameElements;
	private readonly timebar: HTMLElement;
	private readonly initialMessage: HTMLElement;
	private readonly time: TimeController;

	private chars: CharacterModel[];
	private selectedCharIndex: number;
	private selectedChar: CharacterModel;

	private revealOrder: Elements[];
	private revealIndex: number;

	private playing = false;
	private canAdvance = false;

	constructor() {
		const game = this.game = document.querySelector('#game')!;
		this.initialMessage = document.querySelector('#initial-message')!;
		this.initialMessage.innerHTML = `<div>Press &lt;${ACTION_KEY}&gt; to start</div>` +
			`<div class="small">Press &lt;${ACTION_KEY}&gt; to advance or &lt;${EXIT_KEY}&gt; to exit.</div>`;

		this.elements = {
			reads: game.querySelector('#reads')!,
			writes: game.querySelector('#writes')!,
			tip: game.querySelector('#tip')!,
		};

		this.timebar = document.querySelector('#timebar') as HTMLElement;
		this.time = new TimeController(this.timebar.querySelector('#progress') as HTMLElement, this.advance.bind(this));

		document.addEventListener('keyup', this.onKeyPress.bind(this));
		game.addEventListener('click', this.onMouseDown.bind(this));
		game.querySelector('#close')?.addEventListener('click', this.exit.bind(this));
	}

	public show(params: Parameters) {
		this.chars = params.kanas
			.map(k => k.groups).flat()
			.map(g => g.characters).flat()
			.filter(c => c && !c.hidden);

		this.revealOrder = [params.studying === 'reads' ? 'writes' : 'reads', params.studying];
		this.selectedCharIndex = -1;
		this.game.classList.add(PLAYING_CLASS);
		this.time.delay = params.time;
		Object.keys(this.elements).forEach(i => this.elements[i].classList.add(INVISIBLE_CLASS));
		setTimeout(this.start.bind(this), PLAY_ANIM_DURATION);
	}

	private start() {
		this.initialMessage.classList.remove(INVISIBLE_CLASS);

		const initialInput = (e: KeyboardEvent | MouseEvent) => {
			if (e instanceof KeyboardEvent) {
				if (e.code === ACTION_KEY) this.startGame();
				else if (e.code === EXIT_KEY) this.exit(e);
				else return;
			} else {
				this.startGame();
			}
			this.initialMessage.classList.add(INVISIBLE_CLASS);
			document.removeEventListener('keyup', initialInput);
			this.game.removeEventListener('click', initialInput);
		}

		document.addEventListener('keyup', initialInput);
		this.game.addEventListener('click', initialInput);
	}

	private startGame() {
		this.playing = true;
		this.canAdvance = true;
		this.nextChar().then(() => this.advance());
	}

	private advance() {
		if (!this.canAdvance) return;
		this.revealIndex++;
		if (this.revealIndex < this.revealOrder.length) {
			this.reveal(this.revealOrder[this.revealIndex]);
		} else {
			this.nextChar().then(() => this.advance());
		}
	}

	private nextChar(): Promise<void> {
		this.revealIndex = -1;

		let i: number;
		do i = Math.floor(Math.random() * this.chars.length);
		while (i === this.selectedCharIndex);

		this.selectedCharIndex = i;
		this.selectedChar = this.chars[i];

		const keys = Object.keys(this.elements);
		keys.forEach(k => this.elements[k].classList.add(INVISIBLE_CLASS));
		return new Promise<void>(resolve => {
			setTimeout(() => {
				this.time.start();
				keys.forEach(k => this.elements[k].innerText = this.selectedChar[k]);
				resolve();
			}, 1000);
		})

	}

	private reveal(el: Elements) {
		this.elements[el].classList.remove(INVISIBLE_CLASS);
	}

	private onKeyPress(e: KeyboardEvent) {
		if (!this.playing) return;
		switch (e.code) {
			case 'Space':
				if (this.time.enabled) this.time.interrupt();
				else this.advance();
				break;
			case 'Escape':
				this.exit(e);
				break;
			case 'KeyT':
				this.reveal('tip');
				break;
			default:
				return;
		}

		e.preventDefault();
		e.stopPropagation();
	}

	private onMouseDown() {
		if (!this.playing) return;
		if (this.time.enabled) this.time.interrupt();
		else this.advance();
	}

	private exit(e?: Event) {
		e?.stopPropagation();
		this.playing = false;
		this.initialMessage.classList.add(INVISIBLE_CLASS);
		Object.keys(this.elements).forEach(i => this.elements[i].classList.add(INVISIBLE_CLASS));
		this.game.classList.remove(PLAYING_CLASS);
	}
}
