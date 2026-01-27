import { CardModel } from '../../core/model/card-model';
import { CardFaceView } from './card-face.view';

export class CardView extends HTMLElement {
	private front: CardFaceView;
	private back: CardFaceView;

	constructor() {
		super();
		this.front = document.querySelector('#card-face-front') as CardFaceView;
		this.back = document.querySelector('#card-face-back') as CardFaceView;
		this.back.style.display = 'none';
	}

	public set model(value: CardModel) {
		this.front.setContent(value.front, value.frontTip);
		this.back.setContent(value.back, value.backTip);
	}
}