import { CellElement, CharacterGroupModel, HeadElement, KanaModel } from '../model';

const SELECTED_CLASS = 'selected';
const COL_CLASS = 'col';
const HEAD_CLASS = 'head';
const CELL_CLASS = 'cell';
const KANA_CLASS = 'kana';
const SELECTABLE_CLASS = 'selectable';

export class KanaPanel extends HTMLElement {
	private readonly allCells: CellElement[] = [];
	private readonly dakutenCells: CellElement[] = [];

	public get hasEnoughSelection() {
		let i = 0;
		return this.allCells.some(e => {
			if (!e.char.hidden) i++;
			return i > 1;
		});
	}

	public connectedCallback() {
		this.classList.add('kana-panel');
	}

	public setup(kana: KanaModel) {
		this.appendChild(this.createTitle(kana.name));
		this.appendChild(this.createTable(kana.groups));
		this.appendChild(this.createFilters());
	}

	private createTitle(title: string): HTMLElement {
		const el = document.createElement('h2');
		el.classList.add('title');
		el.innerText = title;
		return el;
	}

	private createTable(groups: CharacterGroupModel[]): HTMLElement {
		const table = document.createElement('div');
		table.classList.add('table');

		const cellClick = this.onCellClick.bind(this);
		const headClick = this.onHeadClick.bind(this);

		groups.forEach(group => {
			const col = table.appendChild(document.createElement('div'));
			col.classList.add(COL_CLASS);

			const head = col.appendChild(document.createElement('div')) as HeadElement;
			head.classList.add(HEAD_CLASS, CELL_CLASS, SELECTABLE_CLASS);
			head.innerText = group.title;
			head.addEventListener('click', headClick);
			head.cells = [];

			group.characters.forEach(char => {
				const cell = col.appendChild(document.createElement('div')) as CellElement;
				cell.classList.add(CELL_CLASS);
				if (!char) return;
				cell.classList.add(SELECTABLE_CLASS, KANA_CLASS);
				if (!char.hidden) cell.classList.add(SELECTED_CLASS);
				cell.char = char;
				cell.innerText = char.kana;
				cell.addEventListener('click', cellClick);
				head.cells.push(cell);
			});

			if (group.dakuten) this.dakutenCells.push(...head.cells);
			this.allCells.push(...head.cells);
		});

		return table;
	}

	private createFilters(): HTMLElement {
		const parent = document.createElement('div');
		parent.classList.add('filters');

		const all = parent.appendChild(document.createElement('div'));
		all.innerHTML = 'all';
		all.classList.add('btn', 'btn-primary');
		all.addEventListener('click', () => this.setAllCellsSelected(this.allCells));

		const dakuten = parent.appendChild(document.createElement('div'));
		dakuten.innerHTML = 'dakuten';
		dakuten.classList.add('btn', 'btn-primary');
		dakuten.addEventListener('click', () => this.setAllCellsSelected(this.dakutenCells));

		return parent;
	}

	private onHeadClick(e: PointerEvent) {
		this.setAllCellsSelected((e.target as HeadElement).cells);
	}

	private onCellClick(e: PointerEvent) {
		const el = e.target as CellElement;
		this.setCellSelected(el, el.char.hidden || false);
	}

	private setAllCellsSelected(cells: CellElement[]) {
		const anyHidden = cells.some(e => e.char.hidden);
		cells.forEach(e => this.setCellSelected(e, anyHidden));
	}

	private setCellSelected(cell: CellElement, selected: boolean) {
		cell.char.hidden = !selected;
		cell.classList.toggle(SELECTED_CLASS, selected);
	}
}
