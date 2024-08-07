export class ResultsPanel extends HTMLElement {
	private readonly charCountLabel: HTMLElement;
	private readonly totalTimeLabel: HTMLElement;
	private readonly speedLabel: HTMLElement;

	constructor() {
		super();

		this.createLabel('title').innerText = 'Characters';

		this.charCountLabel = this.createLabel('char-count', 'value-label');
		this.charCountLabel.innerText = '1234';

		this.createLabel('title').innerText = 'Total Time';

		this.totalTimeLabel = this.createLabel('total-time', 'value-label');
		this.totalTimeLabel.innerText = '4321ms';

		this.createLabel('title').innerText = 'Average Speed';
		this.speedLabel = this.createLabel('speed', 'value-label');
		this.speedLabel.innerText = '4321 char/s';

		const exit = this.appendChild(document.createElement('div'));
		exit.classList.add('exit-button');
		exit.addEventListener('click', this.exit.bind(this));

		// this.classList.add('visible');
	}

	private createLabel(...classes: string[]) {
		const label = this.appendChild(document.createElement('div'));
		label.classList.add(...classes);
		return label;
	}

	public show(charCount: number, totalTime: number) {
		this.classList.add('visible');
		this.charCountLabel.innerText = charCount.toString(10);
		this.totalTimeLabel.innerText = totalTime.toString(10);
	}

	private exit() {
		this.classList.remove('visible');
	}
}

// TODO
//	* new record! save on cookies and show a badge when the speed is smaller
