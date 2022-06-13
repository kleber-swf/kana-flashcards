// #region Content Selector

export interface HeadElement extends HTMLTableCellElement {
	cells: CellElement[],
}

export interface CellElement extends HTMLTableCellElement {
	char: CharacterModel,
}

// #endregion


// #region Game

export type Elements = 'reads' | 'writes' | 'tip';

export interface GameElements extends Record<Elements, HTMLElement> { }

export interface CharacterModel extends Record<Elements, string> {
	hidden?: boolean;
}

export interface CharacterGroupModel {
	title: string;
	characters: CharacterModel[];
	dakuten?: boolean;
}

export interface KanaModel {
	name: string;
	groups: CharacterGroupModel[];
}

// #endregion
