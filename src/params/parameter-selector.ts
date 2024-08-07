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
			training: this.optionsPanel.training,
			revealDelay: this.optionsPanel.revealDelay,
			autoAdvanceDelay: this.optionsPanel.autoAdvanceDelay,
			kanas: this.kanas,
		}
	}

	public setup(kanas: KanaModel[]) {
		this.kanas = kanas;
		const kanasParent = document.querySelector('#kanas') as HTMLElement;
		this.kanaPanels = kanas.map(kana => new KanaPanel(kanasParent, kana));
		this.optionsPanel = new OptionsPanel(document.querySelector('#options') as HTMLElement);
	}
}