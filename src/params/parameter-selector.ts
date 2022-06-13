import { KanaModel, Parameters } from '../model';
import { KanaPanel } from './kana-panel';

export class ParameterSelector {
	private panels: KanaPanel[];
	private _data: Parameters;

	public get canStart() { return this.panels.every(p => p.hasEnoughSelection); }
	public get data() { return this._data; }

	public setup(parent: HTMLElement, kanas: KanaModel[]) {
		this._data = { kanas };
		this.panels = kanas.map(kana => new KanaPanel(parent, kana));
	}
}