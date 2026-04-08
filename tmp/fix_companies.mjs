import fs from 'fs';

let content = fs.readFileSync('lib/companies.ts', 'utf8');

const replacements = {
  'https://logo.clearbit.com/ibm.com': '/logos/ibm.svg',
  'https://logo.clearbit.com/microsoft.com': '/logos/microsoft.svg',
  'https://logo.clearbit.com/nokia.com': '/logos/nokia.svg',
  'https://logo.clearbit.com/stpi.in': '/logos/stpi.jpg',
};

for (const [clearbit, local] of Object.entries(replacements)) {
  content = content.replace(`"logo": "${clearbit}"`, `"logo": "${local}"`);
}

// Replace the remaining clearbit URLs with Google Favicons
content = content.replace(/https:\/\/logo\.clearbit\.com\/([^"]+)/g, 'https://www.google.com/s2/favicons?sz=256&domain=$1');

fs.writeFileSync('lib/companies.ts', content);
console.log('Done!');
