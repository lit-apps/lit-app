import fs from 'fs';
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';

const manifest = JSON.parse(fs.readFileSync('./docs/custom-elements.json', 'utf-8'));
const markdown = customElementsManifestToMarkdown(manifest);

fs.writeFileSync('./docs/custom-elements.md', markdown);