const ERROR_TIMEOUT = 2000;
const VISIBLE_CLASS = 'visible';

const error = document.querySelector('#error')! as HTMLElement;
let timeout: any;

export function showError(message: string) {
	error.innerText = message;
	error.classList.add(VISIBLE_CLASS);
	if (timeout) clearTimeout(timeout);
	timeout = setTimeout(() => {
		timeout = null;
		error.classList.remove(VISIBLE_CLASS);
	}, ERROR_TIMEOUT);
}
