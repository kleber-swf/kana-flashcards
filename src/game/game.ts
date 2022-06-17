import gsap from 'gsap';
import { CharacterModel, Parameters, Train } from '../model';

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
	private hasRevealDelay: boolean;
	private hasAdvanceDelay: boolean;

	private playing: boolean;
	private selectedCharIndex: number;

	constructor() {
		super();
		this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
		this.playing = false;

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
			: `Touch or press ${ACTION_KEY} to start`;

		const exit = this.appendChild(document.createElement('div'));
		exit.classList.add('exit-button');
		exit.addEventListener('click', this.exit.bind(this));

		this.addEventListener('click', this.onTouch.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	public start(params: Parameters) {
		this.chars = params.kanas
			.map(k => k.groups).flat()
			.map(g => g.characters)
			.flat()
			.filter(c => c && !c.hidden);

		this.clear();

		this.createTimeline(params.training, params.revealDelay, params.autoAdvanceDelay);
		this.classList.add(PLAYING_CLASS);

		this.showInitialMessage();
	}

	private showInitialMessage() {
		this.initialMessage.style.opacity = '1';

		const initialInput = (e: KeyboardEvent | MouseEvent) => {
			if (e instanceof KeyboardEvent) {
				if (e.code === ACTION_KEY) {
					this.playing = true;
					this.nextCharacter();
				} else if (e.code === EXIT_KEY) {
					this.exit();
				} else return;
			} else {
				this.playing = true;
				this.nextCharacter();
			}

			e.preventDefault();
			e.stopPropagation();

			this.initialMessage.style.opacity = '0';
			document.removeEventListener('keyup', initialInput);
			this.removeEventListener('click', initialInput);
		};

		document.addEventListener('keyup', initialInput);
		this.addEventListener('click', initialInput);
	}

	private createTimeline(training: Train, revealDelay: number, autoAdvanceDelay: number) {
		this.hasRevealDelay = !isNaN(revealDelay) && revealDelay > 0;
		this.hasAdvanceDelay = !isNaN(autoAdvanceDelay) && autoAdvanceDelay > 0;
		const chars = training === 'reads' ? [this.kana, this.romaji] : [this.romaji, this.kana];

		const timeline = this.timeline = gsap.timeline({ paused: true })
			.fromTo(chars, { opacity: 1 }, { opacity: 0, duration: 0.6 })
			.call(() => this.randomCharacter())
			.addLabel('step1')
			.fromTo(chars[0], { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5 })
			.addLabel('step2');

		if (this.hasRevealDelay) {
			timeline.set({}, { delay: revealDelay })
				.addLabel('step3')
				.fromTo(this.progress, { width: '100%' }, { width: 0, duration: revealDelay, ease: 'none' }, 'step2');
		}

		timeline.fromTo(chars[1], { opacity: 0 }, { opacity: 1, duration: 1 });

		if (this.hasAdvanceDelay) {
			timeline.addLabel('step4')
				.fromTo(this.progress, { width: 0 }, { width: '100%', duration: autoAdvanceDelay, ease: 'none' })
				.addLabel('step5')
				.call(this.nextStep.bind(this), undefined, 'step5+=0.1');
		}
	}

	private randomCharacter() {
		let i: number;
		do i = Math.floor(Math.random() * this.chars.length);
		while (i === this.selectedCharIndex);
		this.selectedCharIndex = i;
		const char = this.chars[i];
		this.romaji.innerText = char.romaji;
		this.kana.innerText = char.kana;
	}

	private nextCharacter() {
		this.timeline.restart();
		if (!this.hasRevealDelay) {
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
		this.kana.innerText = '';
		this.romaji.innerText = '';
		this.initialMessage.style.opacity = '0';
		this.progress.style.width = '0';
	}

	private exit() {
		this.playing = false;
		this.timeline.clear(true);
		this.classList.remove(PLAYING_CLASS);
	}

	private onTouch() {
		if (this.playing) this.nextStep();
	}

	private onKeyUp(e: KeyboardEvent) {
		if (!this.playing) return;
		if (e.code === ACTION_KEY) this.nextStep();
		else if (e.code === EXIT_KEY) this.exit();
		else return;
		e.preventDefault();
		e.stopPropagation();
	}
}
