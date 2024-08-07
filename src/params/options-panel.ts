import { Study } from '../model';

export class OptionsPanel {
	private readonly timeElement: HTMLInputElement;
	private readonly studyingElement: HTMLSelectElement;

	public get time() { return parseInt(this.timeElement.value) * 1000; }
	public get studying() { return this.studyingElement.value as Study; }

	public constructor(panel: HTMLElement) {
		this.timeElement = panel.querySelector('#time') as HTMLInputElement;
		this.studyingElement = panel.querySelector('#studying') as HTMLSelectElement;
	}
}
