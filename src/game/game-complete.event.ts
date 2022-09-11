export class GameCompleteEvent extends Event {
	constructor(public readonly charCount: number, public readonly time: number) {
		super('complete');
	}
}
