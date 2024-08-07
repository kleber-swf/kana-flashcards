import merge from 'deepmerge-json';
import { KanaModel, Parameters } from '../model';
import { KanaPanel } from './kana-panel';
import { OptionsPanel } from './options-panel';

export class ParameterSelector {
	private kanaPanels: KanaPanel[];
	private optionsPanel: OptionsPanel;

	private kanas: KanaModel[];

	public get canStart() {
		return this.kanaPanels.some(p => p.hasEnoughSelection);
	}

	public get data(): Parameters {
		return {
			training: this.optionsPanel.training,
			revealDelay: this.optionsPanel.revealDelay,
			autoAdvanceDelay: this.optionsPanel.autoAdvanceDelay,
			withAudio: this.optionsPanel.withAudio,
			kanas: this.kanas,
		};
	}

	public setup(kanas: KanaModel[], saved: string | null) {
		const kanaParent = document.querySelector('#kanas') as HTMLElement;
		const initialData = this.getInitialData(kanas, saved);
		this.kanas = initialData.kanas;

		this.kanaPanels = initialData.kanas.map(kana => {
			const panel = document.createElement('kana-panel') as KanaPanel;
			kanaParent.appendChild(panel);
			panel.setup(kana);
			return panel;
		});

		this.optionsPanel = new OptionsPanel(
			document.querySelector('#options') as HTMLElement,
			initialData
		);
	}

	private getInitialData(kanas: KanaModel[], saved: string | null): Parameters {
		const params: Parameters = { training: 'write', revealDelay: 0, autoAdvanceDelay: 0, kanas, withAudio: true };
		return saved ? merge(params, JSON.parse(saved)) : params;
	}
}
