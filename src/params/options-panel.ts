import { Parameters } from '../model';

export class OptionsPanel {
	private data: Parameters;

	public setup(panel: HTMLElement, data: Parameters) {
		this.data = data;
		(panel.querySelector('#time') as HTMLInputElement)!
			.addEventListener('change', this.onTimeChanged.bind(this));
	}

	private onTimeChanged(e: Event) {
		const value = parseInt((e.target as HTMLInputElement).value, 10);
		this.data.time = value * 1000;
	}
}
