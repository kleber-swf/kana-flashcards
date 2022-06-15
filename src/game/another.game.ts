import gsap from 'gsap';
import { CharacterModel, Parameters, Study } from '../model';

const ACTION_KEY = 'Space';

export class AnotherGame extends HTMLElement {
	private readonly kana: HTMLElement;
	private readonly romaji: HTMLElement;
	private readonly timelineParams: GSAPTimelineVars;

	private chars: CharacterModel[];
	private hasTime: boolean;

	private timeline: GSAPTimeline;
	private selectedCharIndex: number;

	constructor() {
		super();

		const parent = this.appendChild(document.createElement('div'));
		parent.classList.add('result');

		this.romaji = parent.appendChild(document.createElement('div'));
		this.romaji.classList.add('romaji');

		this.kana = parent.appendChild(document.createElement('div'));
		this.kana.classList.add('kana');

		this.timelineParams = { onComplete: this.onTimelineComplete.bind(this) };

		document.addEventListener('click', this.onClick.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	public start(params: Parameters) {
		this.chars = params.kanas
			.map(k => k.groups).flat()
			.map(g => g.characters).flat()
			.filter(c => c && !c.hidden);
		this.createTimeline(params.studying, params.time);
		this.nextCharacter();
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

	private onTimelineComplete() {
		console.log(this.timeline);
	}

	private onClick() {
		this.nextStep();
	}

	private onKeyUp(e: KeyboardEvent) {
		if (e.code === ACTION_KEY) {
			this.nextStep();
		}
	}
}