import { ALPHABETS, CharacterModel, Train } from '../model';

export class InitialMessage extends HTMLElement {
	private readonly trainingMessage: HTMLElement;
	private readonly infoMessage: HTMLElement;

	public set info(value: string) {
		this.infoMessage.innerHTML = value;
	}

	public constructor() {
		super();
		this.trainingMessage = this.appendChild(document.createElement('div'));
		this.infoMessage = this.appendChild(document.createElement('small'));
	}

	public connectedCallback() {
		this.classList.add('initial-message');
		this.style.opacity = '0';
		this.trainingMessage.classList.add('training-message');
	}

	public show(train: Train, chars: CharacterModel[]) {
		this.style.opacity = '1';
		const alphabets = ALPHABETS
			.filter(e => chars.some(c => c.alphabet === e))
			.map(e => `<span class="${e}">${e}</span>`)
			.join(' ');

		const training = train === 'write' ? 'A ➔ あ' : 'あ ➔ A';
		this.trainingMessage.innerHTML = `<p>${training}</br>${alphabets}</p>`;
	}

	public hide() {
		this.style.opacity = '0';
	}
}
