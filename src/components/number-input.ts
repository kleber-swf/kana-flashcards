interface Btn extends HTMLElement {
	increment: -1 | 1;
}

export class NumberInput extends HTMLElement {
	private readonly input: HTMLInputElement;

	private iid: any;
	private buttonIsDown = false;
	private _value: number;

	public get value() { return this._value; }

	public set value(value: number) {
		const min = parseInt(this.input.min);
		const max = parseInt(this.input.max);
		if (isNaN(value)) value = min;
		this._value = value;
		this.input.value = Math.floor(Math.min(Math.max(value, min), max)).toString(10);
	}

	constructor() {
		super();
		this.createButton(-1, '-');
		this.input = this.createInput();
		this.createButton(1, '+');
	}

	public connectedCallback() {
		const min = this.getAttribute('min');
		this.input.setAttribute('min', min || '');
		this.input.setAttribute('max', this.getAttribute('max') || '');
		this.input.setAttribute('value', this.getAttribute('value') || min || '0');
		this._value = this.input.valueAsNumber ?? 0;
	}

	private createInput() {
		const input = this.appendChild(document.createElement('input'));
		input.type = 'number';
		input.addEventListener('change', e => this.value = (e.target as HTMLInputElement).valueAsNumber);
		return input;
	}

	private createButton(increment: -1 | 1, text: string) {
		const btn = this.appendChild(document.createElement('div')) as unknown as Btn;
		btn.setAttribute('action', increment === 1 ? 'up' : 'down');
		btn.innerText = text;
		btn.increment = increment;
		btn.addEventListener('mousedown', this.onButtonDown.bind(this));
		btn.addEventListener('mouseup', this.onButtonUp.bind(this));
	}

	private onButtonDown(e: PointerEvent) {
		const inc = (e.target as Btn).increment;
		this.incrementValue(inc);
		this.buttonIsDown = true;

		this.iid = setTimeout(() => {
			if (!this.buttonIsDown) return;
			this.incrementValue(inc);
			this.iid = setInterval(() => this.incrementValue(inc), 80);
		}, 500);
	}

	private onButtonUp() {
		this.buttonIsDown = false;
		clearInterval(this.iid);
	}

	private incrementValue(increment: -1 | 1) {
		this.value = this.value + increment;
	}
}
