import { KanaModel, Parameters } from '../model';
import { KanaPanel } from './kana-panel';
import { OptionsPanel } from './options-panel';

export class ParameterSelector {
	private kanaPanels: KanaPanel[];
	private optionsPanel: OptionsPanel;

	private kanas: KanaModel[];

	public get canStart() { return this.kanaPanels.every(p => p.hasEnoughSelection); }
	public get data(): Parameters {
		return {
			studying: this.optionsPanel.studying,
			time: this.optionsPanel.time,
			kanas: this.kanas
		}
	}

	public setup(parent: HTMLElement, kanas: KanaModel[]) {
		this.kanas = kanas;
		this.kanaPanels = kanas.map(kana => new KanaPanel(parent, kana));
		this.optionsPanel = new OptionsPanel(document.querySelector('#options') as HTMLElement);
	}
}