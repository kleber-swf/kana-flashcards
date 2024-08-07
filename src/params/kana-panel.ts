import { CellElement, CharacterGroupModel, HeadElement, KanaModel } from '../model';

const SELECTED_CLASS = 'selected';
const KANA_CLASS = 'kana';

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
		const table = document.createElement('table');
		const header = table.createTHead().insertRow();
		const body = table.createTBody();
		const rows: HTMLTableRowElement[] = groups[0].characters.map(() => body.insertRow());

		const cellClick = this.onCellClick.bind(this);
		const headClick = this.onHeadClick.bind(this);

		groups.reverse().forEach(group => {
			const head = header.insertCell() as HeadElement;
			head.innerText = group.title;
			head.cells = [];
			head.addEventListener('click', headClick);

			group.characters.forEach((c, i) => {
				const cell = rows[i].insertCell() as CellElement;
				if (!c) return;
				cell.addEventListener('click', cellClick);
				cell.classList.add(SELECTED_CLASS, KANA_CLASS);
				cell.innerHTML = c.kana;
				cell.char = c;
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