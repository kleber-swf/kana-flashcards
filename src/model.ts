// #region Paramters

export interface Parameters {
	training: Train;
	revealDelay: number;
	autoAdvanceDelay: number;
	kanas: KanaModel[];
}

export interface HeadElement extends HTMLTableCellElement {
	cells: CellElement[],
}

export interface CellElement extends HTMLTableCellElement {
	char: CharacterModel,
}

// #endregion

// #region Game

export type Train = 'reads' | 'writes';
export type Alphabet = typeof ALPHABETS[number];
export const ALPHABETS = ['hiragana', 'katakana'] as const;

export interface CharacterModel {
	kana: string;
	romaji: string;
	hidden?: boolean;
	alphabet: Alphabet;
}

export interface CharacterGroupModel {
	title: string;
	characters: CharacterModel[];
	dakuten?: boolean;
}

export interface KanaModel {
	name: Alphabet;
	groups: CharacterGroupModel[];
}

// #endregion
