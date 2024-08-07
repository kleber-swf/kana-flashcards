const join = require('path').join;
const fs = require('fs/promises');

const BASEDIR = process.cwd();
const indexPath = join(BASEDIR, 'dist/index.html');

Promise.all([
	fs.readFile(join(BASEDIR, 'package.json'), 'utf-8'),
	fs.readFile(indexPath, 'utf-8'),
]).then(files => {
	const version = JSON.parse(files[0]).version;
	fs.writeFile(indexPath, files[1]
		.replace('$VERSION$', version), 'utf-8');
});
