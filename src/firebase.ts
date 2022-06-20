import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyAFyfWLwF-SDx_BBQ1M9TSeo7wc2Vjtu9o',
	authDomain: 'kana-flashcards-e054a.firebaseapp.com',
	projectId: 'kana-flashcards-e054a',
	storageBucket: 'kana-flashcards-e054a.appspot.com',
	messagingSenderId: '989895456290',
	appId: '1:989895456290:web:7e921530159d64e3547c7b',
	measurementId: 'G-B931JY50SV',
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
