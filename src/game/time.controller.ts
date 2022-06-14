const PROGRESS_DELAY = 10;

export class TimeController {
	private readonly progress: HTMLElement;
	private readonly callback: () => void;

	private tid: any;
	public delay: number;

	public get enabled() { return this.tid && this.delay > 0; }

	constructor(progress: HTMLElement, callback: () => void) {
		this.progress = progress;
		this.callback = callback;
	}

	public start() {
		if (this.delay <= 0) return false;

		clearTimeout(this.tid);
		this.tid = setTimeout(() => {
			this.tid = null;
			this.callback();
		}, this.delay + PROGRESS_DELAY);

		this.progress.style.width = '100%';
		this.progress.style.transition = `width ${PROGRESS_DELAY}ms linear`;

		setTimeout(() => {
			this.progress.style.transition = `width ${this.delay}ms linear`;
			this.progress.style.width = '0';
		}, PROGRESS_DELAY);

		return true;
	}

	public interrupt() {
		clearTimeout(this.tid);
		this.tid = null;
		this.progress.style.transition = 'none';
		this.progress.style.width = '0';
		this.callback();
	}
}
