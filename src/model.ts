export type Elements = 'reads' | 'writes' | 'tip';

export interface GameElements extends Record<Elements, HTMLElement> { }

export interface CharacterModel extends Record<Elements, string> {
	hidden?: boolean;
}

export interface CharacterGroupModel {
	title: string;
	characters: CharacterModel[];
}

export interface KanaModel {
	name: string;
	groups: CharacterGroupModel[];
}