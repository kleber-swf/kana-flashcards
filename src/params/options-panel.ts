import { TextToggle } from '../components/text-toggle';
import { Parameters, Train } from '../model';

export class OptionsPanel {
	private readonly trainingElement: TextToggle;

	public get training(): Train { return this.trainingElement.selected ? 'write' : 'read'; }

	public constructor(panel: HTMLElement, data: Parameters) {
		this.trainingElement = panel.querySelector('#training') as TextToggle;
		this.trainingElement.selected = data.training === 'write';
	}
}
