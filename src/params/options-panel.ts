import { NumberInput } from '../components/number-input';
import { TextToggle } from '../components/text-toggle';
import { Study } from '../model';

export class OptionsPanel {
	private readonly revealDelayElement: NumberInput;
	private readonly autoAdvanceElement: NumberInput;
	private readonly studyingElement: TextToggle;

	public get revealDelay() { return this.revealDelayElement.value; }
	public get autoAdvanceDelay() { return this.autoAdvanceElement.value; }
	public get studying(): Study { return this.studyingElement.selected ? 'writes' : 'reads'; }

	public constructor(panel: HTMLElement) {
		this.revealDelayElement = panel.querySelector('#reveal-delay') as NumberInput;
		this.autoAdvanceElement = panel.querySelector('#auto-advance') as NumberInput;
		this.studyingElement = panel.querySelector('#studying') as TextToggle;
	}
}
