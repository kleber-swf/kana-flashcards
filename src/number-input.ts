export class NumberInput extends HTMLElement {
	private readonly input: HTMLInputElement;
	public get value() { return this.input.valueAsNumber; }

	public set value(value: number) {
		const min = parseInt(this.input.min);
		const max = parseInt(this.input.max);
		if (isNaN(value)) value = min;
		this.input.value = Math.floor(Math.min(Math.max(value, min), max)).toString(10);
	}

	constructor() {
		super();

		const prev = this.appendChild(document.createElement('div'));
		prev.setAttribute('action', 'down');
		prev.innerText = '-';
		prev.addEventListener('click', () => this.value = this.value - 1);

		const input = this.appendChild(document.createElement('input'));
		input.type = 'number';
		input.addEventListener('change', e => this.value = (e.target as HTMLInputElement).valueAsNumber);
		this.input = input;

		const next = this.appendChild(document.createElement('div'));
		next.setAttribute('action', 'up');
		next.innerText = '+';
		next.addEventListener('click', () => this.value = this.value + 1);

	}

	public connectedCallback() {
		this.input.setAttribute('min', this.getAttribute('min') || '');
		this.input.setAttribute('max', this.getAttribute('max') || '');
		this.input.setAttribute('value', this.getAttribute('value') || '');
	}

}
