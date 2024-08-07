import gsap from 'gsap';
import { CharacterModel, Parameters, Study } from '../model';

const ACTION_KEY = 'Space';
const EXIT_KEY = 'Escape';
const PLAYING_CLASS = 'playing';

export class Game extends HTMLElement {
	private readonly isMobile: boolean;
	private readonly kana: HTMLElement;
	private readonly romaji: HTMLElement;
	private readonly progress: HTMLElement;
	private readonly initialMessage: HTMLElement;

	private chars: CharacterModel[];
	private timeline: GSAPTimeline;
	private hasTime: boolean;

	private selectedCharIndex: number;

	constructor() {
		super();
		this.isMobile = /Mobi|Android/i.test(navigator.userAgent);

		const result = this.appendChild(document.createElement('div'));
		result.classList.add('result');

		this.romaji = result.appendChild(document.createElement('div'));
		this.romaji.classList.add('romaji');

		this.kana = result.appendChild(document.createElement('div'));
		this.kana.classList.add('kana');

		this.progress = this.appendChild(document.createElement('div'));
		this.progress.classList.add('time-progress');

		this.initialMessage = this.appendChild(document.createElement('div'));
		this.initialMessage.classList.add('initial-message');
		this.initialMessage.style.opacity = '0';
		this.initialMessage.innerHTML = this.isMobile
			? 'Touch to start'
			: `Touch or press &lt;${ACTION_KEY}&gt; to start`;

		const exit = this.appendChild(document.createElement('div'));
		exit.classList.add('exit-button');
		exit.addEventListener('click', this.exit.bind(this));

		this.addEventListener('click', this.onClick.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	public start(params: Parameters) {
		this.chars = params.kanas
			.map(k => k.groups).flat()
			.map(g => g.characters).flat()
			.filter(c => c && !c.hidden);

		this.createTimeline(params.studying, params.time);
		this.classList.add(PLAYING_CLASS);

		this.clear();
		this.showInitialMessage();
	}

	private showInitialMessage() {
		this.initialMessage.style.opacity = '1';

		const initialInput = (e: KeyboardEvent | MouseEvent) => {
			console.log(e)
			if (e instanceof KeyboardEvent) {
				if (e.code === ACTION_KEY) this.nextCharacter();
				else if (e.code === EXIT_KEY) this.exit();
				else return;
			} else this.nextCharacter();

			e.preventDefault();
			e.stopPropagation();
			this.initialMessage.style.opacity = '0';
			document.removeEventListener('keyup', initialInput);
			this.removeEventListener('click', initialInput);
		}

		document.addEventListener('keyup', initialInput);
		this.addEventListener('click', initialInput);
	}

	private createTimeline(studying: Study, time: number) {
		this.hasTime = !isNaN(time) && time > 0;
		const chars = studying === 'reads' ? [this.kana, this.romaji] : [this.romaji, this.kana];

		this.timeline = gsap.timeline({ paused: true })
			.to(chars, { opacity: 0, duration: 0.5 })
			.call(() => this.randomCharacter())
			.addLabel('step1')
			.to(chars[0], { opacity: 1, duration: 0.5 })
			.addLabel('step2');

		if (this.hasTime) {
			this.timeline.set({}, { delay: time }).addLabel('step3')
			this.timeline.fromTo(this.progress, { width: '100%' }, { width: 0, duration: time, ease: 'none' }, 'step2');
		} else {
			this.progress.style.width = '0';
		}

		this.timeline.to(chars[1], { opacity: 1, duration: 0.5 });
	}

	private randomCharacter() {
		let i: number;
		do i = Math.floor(Math.random() * this.chars.length);
		while (i === this.selectedCharIndex);
		this.selectedCharIndex = i;
		const char = this.chars[i];
		this.romaji.innerText = char.reads;
		this.kana.innerText = char.writes;
	}

	private nextCharacter() {
		this.timeline.restart();
		if (!this.hasTime) {
			this.timeline.tweenFromTo(0, 'step2');
		}
	}


	private nextStep() {
		if (this.timeline.progress() === 1) {
			this.nextCharacter();
			return;
		}

		if (!this.timeline.currentLabel()) return;

		const nextLabel = this.timeline.nextLabel();
		if (nextLabel) this.timeline.play(nextLabel);
		else this.timeline.resume();
	}

	private clear() {
		this.kana.style.opacity = '0';
		this.romaji.style.opacity = '0';
		this.initialMessage.style.opacity = '0';
		this.progress.style.width = '0';
	}

	private exit() {
		this.timeline.clear(true);
		this.classList.remove(PLAYING_CLASS);
	}

	private onClick() {
		this.nextStep();
	}

	private onKeyUp(e: KeyboardEvent) {
		if (e.code === ACTION_KEY) this.nextStep();
		else if (e.code === EXIT_KEY) this.exit();
		else return;
		e.preventDefault();
		e.stopPropagation();
	}
}