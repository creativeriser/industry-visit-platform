import fs from 'fs';

const file = '/Users/vikrantsingh/B.Tech/Semester 6/CodeX/industry-visit-platform/lib/companies.ts';
let content = fs.readFileSync(file, 'utf8');

const map = {
  '"name": "Infosys",': '"logo": "/logos/infosys.svg",',
  '"name": "HCL Technologies",': '"logo": "/logos/hcl.png",',
  '"name": "BLogic Software Company",': '"logo": "/logos/blogic.png",',
  '"name": "Deloitte India",': '"logo": "/logos/deloitte.png",',
  '"name": "KPMG India",': '"logo": "/logos/kpmg.png",',
  '"name": "IBM India",': '"logo": "/logos/ibm.png",',
  '"name": "Huawei Technologies",': '"logo": "/logos/huawei.png",',
  '"name": "VVDN Technologies",': '"logo": "/logos/vvdn.png",',
  '"name": "Bhamashah Techno Hub",': '"logo": "/logos/bhamashah.png",',
  '"name": "HCL Tech",': '"logo": "/logos/hcl.png",',
  '"name": "National Stock Exchange",': '"logo": "/logos/nse.png",',
  '"name": "Nokia Networks",': '"logo": "/logos/nokia.png",',
  '"name": "MediaTek India",': '"logo": "/logos/mediatek.png",',
  '"name": "Appsquadz Software",': '"logo": "/logos/appsquadz.png",',
  '"name": "CS Soft Solution",': '"logo": "/logos/cssoft.png",',
  '"name": "Microsoft India",': '"logo": "/logos/microsoft.png",',
  '"name": "Software Technology Parks of India",': '"logo": "/logos/stpi.png",',
  '"name": "JP Infotech",': '"logo": "/logos/jpinfotech.png",',
  '"name": "Kaashiv InfoTech",': '"logo": "/logos/kaashiv.png",'
};

let lines = content.split('\n');
let modified = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  modified.push(line);
  
  for (const [key, logoStr] of Object.entries(map)) {
    if (line.includes(key)) {
      let j = i + 1;
      while (j < lines.length && !lines[j].includes('"image":')) {
        j++;
      }
      if (j < lines.length) {
         if (!lines[j+1].includes('"logo"')) {
            modified[j] = modified[j] + '\n        ' + logoStr;
         }
      }
      break;
    }
  }
}

fs.writeFileSync(file, modified.join('\n'));
console.log("Done");
