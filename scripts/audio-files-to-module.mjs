import fs from 'fs/promises';

const IN_DIR = './audio';
const EXT = '.mp3';
const EXT_LEN = EXT.length;

const OUT_FILE = './src/audio.ts';
const OUT_REL_PATH = '../audio'
const OUT_HEADER = 'export const AUDIO = {';
const OUT_FOOTER = '};';

const files = (await fs.readdir(IN_DIR,))
	.filter(e => e.endsWith(EXT))
	.map(e => `	${e.substring(0, e.length - EXT_LEN).replace('-', '')}: require('${OUT_REL_PATH}/${e}'),`)
	.join('\n');

try {
	const content = `${OUT_HEADER}\n${files}\n${OUT_FOOTER}\n`;
	await fs.writeFile(OUT_FILE, content);
	console.log(`Successfully created file: ${OUT_FILE}`);
} catch (e) {
	console.error(`Error trying to save output file at ${OUT_FILE}`);
	console.error(e);
}

