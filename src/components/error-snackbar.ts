const ERROR_TIMEOUT = 2000;
const VISIBLE_CLASS = 'visible';

export class ErrorSnackbar extends HTMLElement {
	private tid: any;

	public connectedCallback() {
		this.style.opacity = '0';
	}

	public show(message: string) {
		this.innerText = message;
		this.classList.add(VISIBLE_CLASS);
		clearTimeout(this.tid);
		this.tid = setTimeout(() => {
			this.tid = null;
			this.classList.remove(VISIBLE_CLASS);
		}, ERROR_TIMEOUT);
	}

	public hide() {
		clearTimeout(this.tid);
		this.tid = null;
		this.classList.remove(VISIBLE_CLASS);
	}
}
