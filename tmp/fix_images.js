const fs = require('fs');
const files = [
  'components/faculty/company-card.tsx',
  'components/student/visit-card.tsx',
  'components/faculty/recommendation-rail.tsx'
];

for (const path of files) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    
    if (content.includes('const [imgError, setImgError] = useState(false)')) continue;

    // Add useState if not imported
    if (content.includes('import { useState }') === false) {
      if (content.includes('import { motion }')) {
        content = content.replace('import { motion }', 'import { useState } from "react"\nimport { motion }');
      } else {
        content = 'import { useState } from "react"\n' + content;
      }
    }

    // Replace the img tag handling
    // 1. Add imgError state inside component
    content = content.replace(/{(?:[\s\S]*?)item\.logo \? \([\s\S]*?<img src={item\.logo}[\s\S]*?: \([\s\S]*?<div[\s\S]*?charAt\(0\)}<\/div>\s*\)\s*}/, (match) => {
        return `{item.logo && !imgError ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.logo} alt={\`\${item.name} logo\`} onError={() => setImgError(true)} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-indigo-300 font-black text-4xl uppercase bg-indigo-50/50">{item.name.charAt(0)}</div>
                    )}`;
    });

    // Add state hook
    content = content.replace(/(export function \w+\([^)]+\)\s*{\s*)/, '$1const [imgError, setImgError] = useState(false)\n    ');
    
    fs.writeFileSync(path, content);
    console.log('Fixed', path);
  }
}
