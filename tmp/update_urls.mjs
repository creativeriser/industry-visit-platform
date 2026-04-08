import fs from 'fs';

const file = '/Users/vikrantsingh/B.Tech/Semester 6/CodeX/industry-visit-platform/lib/companies.ts';
let content = fs.readFileSync(file, 'utf8');

const urlMap = {
  '"logo": "/logos/infosys.svg",': '"logo": "/logos/infosys.svg",', // keep infosys local as pilot
  '"logo": "/logos/hcl.png",': '"logo": "https://logo.clearbit.com/hcltech.com",',
  '"logo": "/logos/blogic.png",': '"logo": "https://logo.clearbit.com/blogicsoftware.com",',
  '"logo": "/logos/deloitte.png",': '"logo": "https://logo.clearbit.com/deloitte.com",',
  '"logo": "/logos/kpmg.png",': '"logo": "https://logo.clearbit.com/kpmg.com",',
  '"logo": "/logos/ibm.png",': '"logo": "https://logo.clearbit.com/ibm.com",',
  '"logo": "/logos/huawei.png",': '"logo": "https://logo.clearbit.com/huawei.com",',
  '"logo": "/logos/vvdn.png",': '"logo": "https://logo.clearbit.com/vvdntech.com",',
  '"logo": "/logos/bhamashah.png",': '"logo": "https://logo.clearbit.com/istart.rajasthan.gov.in",',
  '"logo": "/logos/nse.png",': '"logo": "https://logo.clearbit.com/nseindia.com",',
  '"logo": "/logos/nokia.png",': '"logo": "https://logo.clearbit.com/nokia.com",',
  '"logo": "/logos/mediatek.png",': '"logo": "https://logo.clearbit.com/mediatek.com",',
  '"logo": "/logos/appsquadz.png",': '"logo": "https://logo.clearbit.com/appsquadz.com",',
  '"logo": "/logos/cssoft.png",': '"logo": "https://logo.clearbit.com/cssoftsolution.com",',
  '"logo": "/logos/microsoft.png",': '"logo": "https://logo.clearbit.com/microsoft.com",',
  '"logo": "/logos/stpi.png",': '"logo": "https://logo.clearbit.com/stpi.in",',
  '"logo": "/logos/jpinfotech.png",': '"logo": "https://logo.clearbit.com/jpinfotech.org",',
  '"logo": "/logos/kaashiv.png",': '"logo": "https://logo.clearbit.com/kaashivinfotech.com",',
};

let modified = content;
for (const [key, value] of Object.entries(urlMap)) {
  modified = modified.replaceAll(key, value);
}

fs.writeFileSync(file, modified);
console.log("Updated URLs");
