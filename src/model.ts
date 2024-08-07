// #region Paramters

export interface Parameters {
	training: Train;
	revealDelay: number;
	autoAdvanceDelay: number;
	kanas: KanaModel[];
	withAudio: boolean;
}

export interface HeadElement extends HTMLTableCellElement {
	cells: CellElement[],
}

export interface CellElement extends HTMLTableCellElement {
	char: CharacterModel,
}

// #endregion

// #region Game

export type Train = 'read' | 'write';

export const ALPHABETS = ['hiragana', 'katakana'] as const;
export type Alphabet = typeof ALPHABETS[number];

export const KANA_TYPES = ['kana', 'yoon'] as const;
export type KanaType = typeof KANA_TYPES[number];

export interface CharacterModel {
	kana: string;
	romaji: string;
	hidden?: boolean;
	alphabet: Alphabet;
	tip?: string;
}

export interface CharacterGroupModel {
	title: string;
	characters: (CharacterModel | null)[];
	dakuten?: boolean;
	type: KanaType;
}

export interface KanaModel {
	name: Alphabet;
	groups: CharacterGroupModel[];
}


export interface FileCharacterModel {
	hiragana: string;
	katakana: string;
	romaji: string;
	ambiguous?: boolean;
}

export interface FileCharacterGroupModel {
	title: string;
	type: KanaType;
	dakuten?: boolean;
	characters: (FileCharacterModel | null)[];
}

export type FileKanaModel = FileCharacterGroupModel[];

// #endregion
