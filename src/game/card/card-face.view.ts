export class CardFaceView extends HTMLElement {
	private mainText: HTMLElement;
	private tipText: HTMLElement;

	constructor() {
		super();
		this.mainText = this.querySelector('.main-text') as HTMLElement;
		this.tipText = this.querySelector('.tip-text') as HTMLElement;
	}

	public setContent(main: string, tip: string) {
		this.mainText.textContent = main;
		this.tipText.textContent = tip ?? '';
	}
}