import { Study } from '../model';
import { NumberInput } from '../number-input';

const LABEL_DICT: Record<Study, string> = { reads: 'Read', writes: 'Write' };

export class OptionsPanel {
	private readonly timeElement: NumberInput;
	private _studying: Study = 'writes';

	public get time() { return this.timeElement.value * 1000; }

	public get studying() { return this._studying; }

	public constructor(panel: HTMLElement) {
		this.timeElement = panel.querySelector('#time') as NumberInput;

		const studying = panel.querySelector('#studying') as HTMLElement;
		studying.innerText = LABEL_DICT[this._studying];
		studying.addEventListener('click', this.toggleStudying.bind(this));
	}

	private toggleStudying(e: Event) {
		const el = (e.target as HTMLElement);
		this._studying = this._studying === 'reads' ? 'writes' : 'reads';
		el.innerText = LABEL_DICT[this._studying];
	}
}
