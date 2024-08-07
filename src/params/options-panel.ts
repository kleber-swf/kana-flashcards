import { NumberInput } from '../components/number-input';
import { TextToggle } from '../components/text-toggle';
import { Parameters, Train } from '../model';

export class OptionsPanel {
	private readonly revealDelayElement: NumberInput;
	private readonly autoAdvanceElement: NumberInput;
	private readonly trainingElement: TextToggle;

	public get revealDelay() { return this.revealDelayElement.value; }
	public get autoAdvanceDelay() { return this.autoAdvanceElement.value; }
	public get training(): Train { return this.trainingElement.selected ? 'writes' : 'reads'; }

	public constructor(panel: HTMLElement, data: Parameters) {
		this.revealDelayElement = panel.querySelector('#reveal-delay') as NumberInput;
		this.revealDelayElement.value = data.revealDelay;

		this.autoAdvanceElement = panel.querySelector('#auto-advance') as NumberInput;
		this.autoAdvanceElement.value = data.autoAdvanceDelay;

		this.trainingElement = panel.querySelector('#training') as TextToggle;
		this.trainingElement.selected = data.training === 'writes';
	}
}
