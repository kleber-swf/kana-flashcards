import { KanaModel, Parameters } from '../model';
import { KanaPanel } from './kana-panel';
import { OptionsPanel } from './options-panel';

export class ParameterSelector {
	private kanas: KanaPanel[];
	private _data: Parameters;

	public get canStart() { return this.kanas.every(p => p.hasEnoughSelection); }
	public get data() { return this._data; }

	public setup(parent: HTMLElement, kanas: KanaModel[]) {
		this._data = { studying: 'writes', time: 0, kanas };
		this.kanas = kanas.map(kana => new KanaPanel(parent, kana));
		new OptionsPanel().setup(document.querySelector('#options') as HTMLElement, this._data);
	}
}