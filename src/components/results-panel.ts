import gsap from 'gsap';

const LS_KEY = 'record';

export class ResultsPanel extends HTMLElement {
	private readonly charCountLabel: HTMLElement;
	private readonly totalTimeLabel: HTMLElement;
	private readonly speedLabel: HTMLElement;
	private readonly recordIcon: HTMLElement;

	private lastRecord: number;

	constructor() {
		super();

		this.createLabel('title').innerText = 'Characters';

		this.charCountLabel = this.createLabel('char-count', 'value-label');
		this.charCountLabel.innerText = '1234';

		this.createLabel('title').innerText = 'Total Time';
		this.totalTimeLabel = this.createLabel('total-time', 'value-label');

		this.createLabel('title').innerText = 'Average Speed';
		const speedGroup = this.appendChild(document.createElement('div'));
		speedGroup.classList.add('speed-group');
		this.speedLabel = this.createLabel('speed', 'value-label');
		speedGroup.appendChild(this.speedLabel);

		this.recordIcon = speedGroup.appendChild(document.createElement('i'));
		this.recordIcon.classList.add('icon-award');

		const exit = this.appendChild(document.createElement('div'));
		exit.classList.add('exit-button');
		exit.addEventListener('click', this.exit.bind(this));

		this.lastRecord = parseFloat(window.localStorage.getItem(LS_KEY) ?? '0');
	}

	private createLabel(...classes: string[]) {
		const label = this.appendChild(document.createElement('div'));
		label.classList.add(...classes);
		return label;
	}

	public show(charCount: number, totalTime: number) {
		if (charCount <= 0) return;
		this.classList.add('visible');

		const speed = charCount / (totalTime / 1000);
		this.charCountLabel.innerText = charCount.toString(10);
		this.totalTimeLabel.innerText = this.formatInterval(totalTime);
		this.speedLabel.innerHTML = `<span class="value">${speed.toFixed(2)}</span><span class="measure">char/s</span>`;

		this.checkNewRecord(speed);
	}

	private checkNewRecord(speed: number) {
		if (speed <= this.lastRecord) {
			gsap.set(this.recordIcon, { alpha: 0 });
			return;
		}

		this.lastRecord = speed;
		window.localStorage.setItem(LS_KEY, speed.toString(10));

		gsap.fromTo(this.recordIcon,
			{ alpha: 0, scale: 0 },
			{ alpha: 1, scale: 2, delay: 1, ease: 'Elastic.easeOut' });
	}

	private exit() {
		this.classList.remove('visible');
	}

	private formatInterval(ms: number) {
		const h = Math.floor(ms / 3600000);
		ms -= h * 3600000;
		const m = Math.floor(ms / 60000);
		ms -= m * 60000;
		const s = Math.floor(ms / 1000);

		return (h > 0 ? (h.toString(10).padStart(2, '0') + ':') : '')
			+ m.toString(10).padStart(2, '0') + ':'
			+ s.toString(10).padStart(2, '0');
	}
}

// TODO
//	* new record! save on cookies and show a badge when the speed is smaller
