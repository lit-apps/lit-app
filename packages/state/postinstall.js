/**
 * We do some postinstall content manipulation because so as to 
 * - enable this package to read from ./src (and not ./dist) in 
 *   a development environment, and 
 * - allow environement prefix (via import.meta.env.VITE_LOCALSTORAGE_PREFIX)
 *   for localstorate prefix. This only works with vitejs 
 */

import pkg from 'replace-in-file';
const { sync} = pkg;

console.info('Replacing content on post-install');

const r1 = sync({
  files: 'package.json',
  from: '"main": "src/index",',
  to: '"main": "dist/index",',
});

if(r1.hasChanged) {
	console.log('package.json "main" is now "dist/index" ');
}

const r2 = sync({
  files: 'dist/decorators/storage.js',
  from: 'import.meta.env.VITE_LOCALSTORAGE_PREFIX',
  to: '{}.VITE_LOCALSTORAGE_PREFIX',
});

if(r2.hasChanged) {
	console.log('vitejs environment variables have been overriden ');
}
