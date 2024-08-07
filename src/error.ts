const ERROR_TIMEOUT = 2000;
const VISIBLE_CLASS = 'visible';

const error = document.querySelector('#error')! as HTMLElement;
let tid: any;

export function showError(message: string) {
	error.innerText = message;
	error.classList.add(VISIBLE_CLASS);
	clearTimeout(tid);
	tid = setTimeout(() => {
		tid = null;
		error.classList.remove(VISIBLE_CLASS);
	}, ERROR_TIMEOUT);
}
