export class GameCompleteEvent extends Event {
	constructor(public readonly charCount: number, public readonly totalTime: number) {
		super('complete');
	}
}
