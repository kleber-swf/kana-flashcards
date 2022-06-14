export class TextToggle extends HTMLElement {
	private _selected: boolean;

	public get selected() { return this._selected; }

	public set selected(value: boolean) {
		this._selected = value;
		this.classList.toggle('selected', value);
		const text = value ? this.getAttribute('selected-text') : this.getAttribute('unselected-text');
		if (text) this.innerText = text;
		this.setAttribute('selected', value.toString());
	}

	constructor() {
		super();
		this.addEventListener('click', this.toggle.bind(this));
	}

	public connectedCallback() {
		const attr = this.getAttribute('selected');
		this.selected = !!attr && attr !== 'false';
	}

	public toggle() { this.selected = !this.selected; }
}
