class Rnd {
	public readonly next: () => number;

	public constructor() {
		this.next = (typeof window.crypto?.getRandomValues === 'function')
			? (() => {
				const arr = new Uint32Array(1);
				return () => {
					window.crypto.getRandomValues(arr);
					return arr[0];
				};
			})()
			: () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
	}

	public between(start: number, end: number) {
		return (this.next() % (end - start)) + start;
	}
}

export const Random = new Rnd();
