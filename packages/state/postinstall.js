/**
 * We do some postinstall content manipulation because so as to 
 * - enable this package to read from ./src (and not ./dist) in 
 *   a development environment, and 
 * - allow environement prefix (via import.meta.env.VITE_LOCALSTORAGE_PREFIX)
 *   for localstorate prefix. This only works with vitejs 
 */

import fs from 'fs'
console.info('Replacing content on post-install');

const pkg = 'package.json'
const storage = 'dist/decorators/storage.js'
fs.readFile(pkg, 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	var result = data.replace(/src\/index/g, 'dist/index');

	fs.writeFile(pkg, result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});

fs.readFile(storage, 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	var result = data.replace(/'import.meta.env.VITE_LOCALSTORAGE_PREFIX'/g, '{}.VITE_LOCALSTORAGE_PREFIX');

	fs.writeFile(storage, result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});

