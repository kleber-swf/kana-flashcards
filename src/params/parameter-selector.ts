import merge from 'deepmerge-json';
import { Alphabet, CharacterGroupModel, CharacterModel, FileCharacterGroupModel, FileCharacterModel, FileKanaModel, KanaModel, Parameters } from '../model';
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

	public setup(characters: FileKanaModel, saved: string | null) {
		const kanas = this.splitCharacters(characters);
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

	private splitCharacters(groups: FileKanaModel): KanaModel[] {
		const hiraganas: CharacterGroupModel[] = [];
		const katakanas: CharacterGroupModel[] = [];

		function toChar(char: FileCharacterModel | null, group: FileCharacterGroupModel, alphabet: Alphabet): CharacterModel | null {
			return char
				? {
					alphabet,
					kana: char[alphabet],
					romaji: char.romaji,
					tip: char.ambiguous ? group.title.substring(0, 1) : undefined
				}
				: null;
		}

		groups.forEach(group => {
			const hchars: (CharacterModel | null)[] = [];
			const kchars: (CharacterModel | null)[] = [];

			group.characters.forEach(char => {
				hchars.push(toChar(char, group, 'hiragana'));
				kchars.push(toChar(char, group, 'katakana'));
			});

			hiraganas.push({ title: group.title, type: group.type, dakuten: group.dakuten, characters: hchars });
			katakanas.push({ title: group.title, type: group.type, dakuten: group.dakuten, characters: kchars });
		});

		return [
			{ name: 'hiragana', groups: hiraganas },
			{ name: 'katakana', groups: katakanas },
		];

	}
}
