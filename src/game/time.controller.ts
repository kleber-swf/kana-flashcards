const PROGRESS_DELAY = 10;

export class TimeController {
	private tid: any;
	private progress: HTMLElement;

	constructor(progress: HTMLElement) {
		this.progress = progress;
	}

	public start(delay: number, callback: () => void) {
		if (this.tid) clearTimeout(this.tid);
		this.tid = setTimeout(callback, delay + PROGRESS_DELAY);
		this.progress.style.width = '100%';
		this.progress.style.transition = `width ${PROGRESS_DELAY}ms linear`;
		setTimeout(() => {
			this.progress.style.transition = `width ${delay}ms linear`;
			this.progress.style.width = '0';
		}, PROGRESS_DELAY);
	}
}
