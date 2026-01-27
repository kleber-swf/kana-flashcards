import { CardModel } from './model/card-model';

export class ContentProvider {
	static getContent(): Promise<CardModel[]> {
		return new Promise<CardModel[]>(resolve => {
			resolve([
				{ front: 'これ', frontTip: '', back: 'this', backTip: '', score: 0.5 },
				{ front: 'それ', frontTip: '', back: 'that', backTip: '', score: 0.3 },
				{ front: 'あれ', frontTip: '', back: 'that', backTip: 'over there', score: 0 },
				{ front: '済みません', frontTip: 'すみません', back: 'sorry', backTip: '', score: 1 },
				{ front: '見ます', frontTip: 'みます', back: 'see', backTip: '', score: 0.45 },
				{ front: '日本語', frontTip: 'にほんご', back: 'Japanese', backTip: 'language', score: 0.17 },
				{ front: 'しあわせ', frontTip: '', back: 'hapiness', backTip: '', score: 0.91 },
				{ front: '自販機', frontTip: 'じはんき', back: 'vending machine', backTip: '', score: 0.364 },
				{ front: '前', frontTip: 'まえ', back: 'in front of', backTip: '', score: 0.541 },
				{ front: 'うちろ', frontTip: '', back: 'behind of', backTip: '', score: 0.432 },
				{ front: '近く', frontTip: 'ちかく', back: 'close to', backTip: '', score: 0.2 },
			]);
		})

	}
}