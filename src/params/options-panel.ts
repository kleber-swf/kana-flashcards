import { NumberInput } from '../components/number-input';
import { TextToggle } from '../components/text-toggle';
import { Study } from '../model';

export class OptionsPanel {
	private readonly timeElement: NumberInput;
	private readonly studyingElement: TextToggle;

	public get time() { return this.timeElement.value * 1000; }

	public get studying(): Study { return this.studyingElement.selected ? 'writes' : 'reads'; }

	public constructor(panel: HTMLElement) {
		this.timeElement = panel.querySelector('#time') as NumberInput;
		this.studyingElement = panel.querySelector('#studying') as TextToggle;
	}
}
