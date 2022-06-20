const INVISIBLE_CLASS = 'invisible';

export class GameTip extends HTMLElement {
	private readonly iconElement: HTMLElement;
	private readonly messageElement: HTMLElement;

	constructor() {
		super();

		this.iconElement = this.appendChild(document.createElement('div'));
		this.iconElement.classList.add('icon');
		this.iconElement.addEventListener('mouseup', this.onIconClick.bind(this));

		this.messageElement = this.appendChild(document.createElement('div'));
		this.messageElement.classList.add('message');
	}

	public connectedCallback() {

	}

	public setup(message: string) {
		this.messageElement.classList.add(INVISIBLE_CLASS);
		if (!message) {
			this.hide();
			return;
		}
		this.classList.remove(INVISIBLE_CLASS);
		this.messageElement.innerText = message;
	}

	public hide() {
		this.classList.add(INVISIBLE_CLASS);
	}

	private onIconClick(e: Event) {
		this.messageElement.classList.remove(INVISIBLE_CLASS);
		this.iconElement.classList.add(INVISIBLE_CLASS);
		e.stopPropagation();
	}
}
