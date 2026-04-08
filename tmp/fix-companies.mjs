import fs from 'fs';

const file = '/Users/vikrantsingh/B.Tech/Semester 6/CodeX/industry-visit-platform/lib/companies.ts';
let content = fs.readFileSync(file, 'utf8');

// The error injected `\n\n\nundefined\n        "logo"` strings. 
// We will replace all occurrences of newlines followed by "undefined" cleanly.
let newContent = content.replace(/\n+undefined\n(\s*"logo":)/g, '\n$1');

// Also remove any stray `undefined` substrings just in case they landed without exact formatting
newContent = newContent.replace(/^\s*undefined\s*\n/gm, '');

fs.writeFileSync(file, newContent);
console.log("Fixed companies.ts");
