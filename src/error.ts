const ERROR_TIMEOUT = 2000;
const VISIBLE_CLASS = 'visible';


export class ErrorHandler {
	private tid: any;
	private element: HTMLElement;

	constructor() {
		this.element = document.querySelector('#error')! as HTMLElement;
	}

	public show(message: string) {
		this.element.innerText = message;
		this.element.classList.add(VISIBLE_CLASS);
		clearTimeout(this.tid);
		this.tid = setTimeout(() => {
			this.tid = null;
			this.element.classList.remove(VISIBLE_CLASS);
		}, ERROR_TIMEOUT);
	}

	public hide() {
		clearTimeout(this.tid);
		this.tid = null;
		this.element.classList.remove(VISIBLE_CLASS);
	}
}

