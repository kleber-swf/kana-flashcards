import gsap from 'gsap';
import { CharacterModel, Parameters } from '../model';

export class AnotherGame extends HTMLElement {
	private readonly kana: HTMLElement;
	private readonly romaji: HTMLElement;

	private chars: CharacterModel[];

	private selectedCharIndex: number;
	private canAdvance: boolean;

	constructor() {
		super();

		this.kana = this.appendChild(document.createElement('div'));
		this.kana.classList.add('kana');

		this.romaji = this.appendChild(document.createElement('div'));
		this.romaji.classList.add('romaji');

		this.canAdvance = true;
		document.addEventListener('click', this.onClick.bind(this));
	}

	public start(params: Parameters) {
		this.chars = params.kanas
			.map(k => k.groups).flat()
			.map(g => g.characters).flat()
			.filter(c => c && !c.hidden);
	}

	private randomCharacter() {
		let i: number;
		do i = Math.floor(Math.random() * this.chars.length);
		while (i === this.selectedCharIndex);
		this.selectedCharIndex = i;
		return this.chars[i];
	}

	private nextCharacter() {
		if (!this.canAdvance) return;
		const char = this.randomCharacter();
		this.canAdvance = false;
		const { romaji, kana } = this;
		const timeline = gsap.timeline({ onComplete: () => { this.canAdvance = true } });
		timeline.add(gsap.to([romaji, kana], { opacity: 0 }));
		timeline.add(gsap.set(romaji, { innerText: char.reads }));
		timeline.add(gsap.set(kana, { innerText: char.writes }));
		timeline.add(gsap.to(romaji, { opacity: 1 }).delay(1));
		timeline.add(gsap.to(kana, { opacity: 1 }).delay(1));
	}

	private onClick() {
		this.nextCharacter();
	}
}