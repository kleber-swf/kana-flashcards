import gsap from 'gsap';
import { ALPHABETS, CharacterModel, Parameters, Train } from '../model';

const ACTION_KEY = 'Space';
const EXIT_KEY = 'Escape';
const PLAYING_CLASS = 'playing';
const HIRAGANA_CLASS = 'hiragana';
const KATAKANA_CLASS = 'katakana';

export class Game extends HTMLElement {
	private readonly isMobile: boolean;
	private readonly kana: HTMLElement;
	private readonly romaji: HTMLElement;
	private readonly progress: HTMLElement;
	private readonly initialMessage: HTMLElement;
	private readonly trainingMessage: HTMLElement;

	private chars: CharacterModel[] = [];
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
		this.trainingMessage = this.initialMessage.appendChild(document.createElement('div'));
		this.trainingMessage.classList.add('training-message');
		this.initialMessage.appendChild(document.createElement('small'))
			.innerHTML = this.isMobile ? 'touch to start' : `touch or press ${ACTION_KEY.toLowerCase()} to start`;

		const exit = this.appendChild(document.createElement('div'));
		exit.classList.add('exit-button');
		exit.addEventListener('click', this.exit.bind(this));

		this.addEventListener('click', this.onTouch.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	public start(params: Parameters) {
		this.chars = params.kanas.map(kana => kana.groups
			// gets only visible characters as a single dimension array
			.map(group => group.characters.filter(c => c && !c.hidden)).flat()
			// adds the alphabet name to each character
			.map(char => ({ ...char, alphabet: kana.name }))).flat();

		this.clear();

		this.createTimeline(params.training, params.revealDelay, params.autoAdvanceDelay);
		this.classList.add(PLAYING_CLASS);

		this.showInitialMessage(params.training);
	}

	private showInitialMessage(train: Train) {
		this.setTrainingMessage(train);
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

	private setTrainingMessage(train: Train) {
		const alphabets = ALPHABETS
			.filter(e => this.chars.some(c => c.alphabet === e))
			.map(e => `<span class="${e}">${e}</span>`)
			.join(' ');

		const training = train === 'writes' ? 'writting' : 'reading';
		this.trainingMessage.innerHTML = `<p>${training}</br>${alphabets}</p>`;
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
				.fromTo(this.progress, { width: 0 }, { width: '100%', duration: autoAdvanceDelay, delay: 1, ease: 'none' })
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
		const { romaji, kana } = this;

		romaji.innerText = char.romaji;
		romaji.classList.toggle(HIRAGANA_CLASS, char.alphabet === 'hiragana');
		romaji.classList.toggle(KATAKANA_CLASS, char.alphabet === 'katakana');

		kana.innerText = char.kana;
		kana.classList.toggle(HIRAGANA_CLASS, char.alphabet === 'hiragana');
		kana.classList.toggle(KATAKANA_CLASS, char.alphabet === 'katakana');
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
