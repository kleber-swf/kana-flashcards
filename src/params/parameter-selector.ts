import { KanaModel, Parameters } from '../model';
import { KanaPanel } from './kana-panel';
import { OptionsPanel } from './options-panel';

export class ParameterSelector {
	private kanaPanels: KanaPanel[];
	private optionsPanel: OptionsPanel;

	private kanas: KanaModel[];

	public get canStart() {
		//return this.kanaPanels.every(p => p.hasEnoughSelection);
		return true;
	}

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
		const kanaParent = document.querySelector('#kanas') as HTMLElement;

		this.kanaPanels = kanas.map(kana => {
			const panel = document.createElement('kana-panel') as KanaPanel;
			kanaParent.appendChild(panel);
			panel.setup(kana);
			return panel;
		});

		this.optionsPanel = new OptionsPanel(document.querySelector('#options') as HTMLElement);
	}
}