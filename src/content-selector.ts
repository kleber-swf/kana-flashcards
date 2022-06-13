import { CharacterGroupModel, KanaModel } from './model';

export class ContentSelector {
	public setup(parent: HTMLElement, kanas: KanaModel[]) {
		kanas.forEach(kana => this.createPanel(parent, kana));
	}

	private createPanel(parent: HTMLElement, kana: KanaModel) {
		parent.appendChild(this.createTitle(kana.name));
		parent.appendChild(this.createTable(kana.groups));
	}

	private createTitle(title: string): HTMLElement {
		const el = document.createElement('div');
		el.classList.add('title');
		el.innerText = title;
		return el;
	}

	private createTable(chars: CharacterGroupModel[]): HTMLElement {
		const table = document.createElement('table');
		const header = table.insertRow();
		chars.forEach(c => {
			const cell = header.insertCell();
			cell.innerText = c.title;
		})
		return table;
	}
}