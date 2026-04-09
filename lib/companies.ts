import { supabase } from "./supabase"

export interface Company {
    id: number
    name: string
    location: string
    discipline: string
    image: string
    logo?: string
    tags: string[]
    type?: string
    capacity?: number
    description: string
    date: string
    requirements: string[]
    itinerary: { time: string; title: string; description: string }[]
    representative: {
        name: string
        role: string
        email: string
        phone: string
    }
}

export const COMPANIES: Company[] = [
    {
        "id": 1,
        "name": "Infosys",
        "location": "Noida / Gurugram",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "logo": "/logos/infosys.svg",
        "tags": [
            "IT",
            "Computer Science"
        ],
        "description": "Global IT services, software development, AI, cloud solutions",
        "date": "May 2, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Infosys."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contactus@infosys.com",
            "phone": "+91-80-28520261"
        }
    },
    {
        "id": 2,
        "name": "HCL Technologies",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=hcltech.com",
        "location": "Noida",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science"
        ],
        "description": "Software services, cybersecurity, cloud computing",
        "date": "May 15, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at HCL Technologies."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "corporate@hcl.com",
            "phone": "+91-120-2520977"
        }
    },
    {
        "id": 3,
        "name": "BLogic Software Company",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=blogicsoftware.com",
        "location": "Noida",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Software Development"
        ],
        "description": "Software development and enterprise IT solutions",
        "date": "May 4, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at BLogic Software Company."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@blogicsoftware.com",
            "phone": "+91-120-4315258"
        }
    },
    {
        "id": 4,
        "name": "Deloitte India",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=deloitte.com",
        "location": "Gurugram",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Finance",
            "Consulting"
        ],
        "description": "Audit and consulting",
        "date": "May 7, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Deloitte India."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "inquiries@deloitte.com",
            "phone": "+91-124-6792000"
        }
    },
    {
        "id": 5,
        "name": "KPMG India",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=kpmg.com",
        "location": "Gurugram",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Finance",
            "Consulting"
        ],
        "description": "Consulting and audit services",
        "date": "May 3, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at KPMG India."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "indiainfo@kpmg.com",
            "phone": "+91-124-3074000"
        }
    },
    {
        "id": 6,
        "name": "IBM India",
        "logo": "/logos/ibm.svg",
        "location": "India",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Software",
            "Technology"
        ],
        "description": "No.12, Subramanya Arcade, Bannerghatta Main Road, Bengaluru India - 560 029",
        "date": "May 15, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at IBM India private limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "rccindia@in.ibm.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 7,
        "name": "Huawei Technologies",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=huawei.com",
        "location": "India",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Software",
            "Technology"
        ],
        "description": "9th Floor, Capital Cyberscape, Gurugram – Manesar Urban Complex, Sector-59, Ullahwas, Gurugram, Haryana – 122011, India.",
        "date": "May 10, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Huawei Technologies."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "support@huawei.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 8,
        "name": "VVDN Technologies",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=vvdntech.com",
        "location": "B-22, Infocity-I,Sector-34, Gurugram,Haryana-...",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Software",
            "Technology"
        ],
        "description": "VVDN Technologies is an Indian technology company that provides end-to-end product engineering, electronics manufacturing, and software services. Founded in 2007, it works in areas like 5G, IoT, networking, automotive, and embedded systems for global clients.",
        "date": "May 10, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at VVDN Technologies."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "ni_dist@vvdntech.in",
            "phone": "8595952079"
        }
    },
    {
        "id": 9,
        "name": "Bhamashah Techno Hub",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=istart.rajasthan.gov.in",
        "location": "India",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Software",
            "Technology"
        ],
        "description": "Address : Sansthan Path, Jhalana Gram, Malviya Nagar, Jaipur, Rajasthan 302017, India",
        "date": "May 13, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Bhamashah Techno Hub."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "helpdesk@istart.rajasthan.gov.in",
            "phone": "0141-2922286"
        }
    },
    {
        "id": 10,
        "name": "HCL Tech",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=hcltech.com",
        "location": "India",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Software",
            "Technology"
        ],
        "description": "HCL Technologies Ltd. | Technology Hub, SEZ Plot No. 3A, Sector 126 | Noida – 201304, India",
        "date": "May 2, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at HCL Tech."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "careers@hcl.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 11,
        "name": "National Stock Exchange",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=nseindia.com",
        "location": "India",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Software",
            "Technology"
        ],
        "description": "National Stock Exchange of India Ltd., 4th Floor, Jeevan Vihar Building, Parliament Street, New Delhi-110 001",
        "date": "May 4, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at National Stock Exchange."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@nse.co.in",
            "phone": "8655986573"
        }
    },
    {
        "id": 12,
        "name": "Nokia Networks",
        "logo": "/logos/nokia.svg",
        "location": "India",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Software",
            "Technology"
        ],
        "description": "DLF Cyber City, Phase II Gurugram, Haryana – 122002 India",
        "date": "May 5, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Nokia Networks Private Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "nokia.iar@nokia.com",
            "phone": "358104488000"
        }
    },
    {
        "id": 13,
        "name": "MediaTek India",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=mediatek.com",
        "location": "India",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Software",
            "Technology"
        ],
        "description": "Noida, Uttar Pradesh India",
        "date": "May 14, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at MediaTek India."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "rakesh.verma@mediatek.com",
            "phone": "1206151000"
        }
    },
    {
        "id": 14,
        "name": "Appsquadz Software",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=appsquadz.com",
        "location": "Noida, Uttar Pradesh (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software Engineering"
        ],
        "description": "IT services, software development, web & mobile application development, cloud solutions, enterprise software",
        "date": "May 14, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Appsquadz Software Pvt. Ltd.."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@appsquadz.com",
            "phone": "+91-120-423-0300"
        }
    },
    {
        "id": 15,
        "name": "CS Soft Solution",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=cssoftsolution.com",
        "location": "Chandigarh / Mohali (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software Engineering"
        ],
        "description": "Software development, web applications, ERP solutions, IT training",
        "date": "May 11, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at CS Soft Solution."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@cssoftsolution.com",
            "phone": "+91-172-462-6323"
        }
    },
    {
        "id": 16,
        "name": "Microsoft India",
        "logo": "/logos/microsoft.svg",
        "location": "Bengaluru (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software Engineering"
        ],
        "description": "Cloud computing (Azure), software products, AI, enterprise solutions",
        "date": "May 8, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Microsoft India."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "indhelp@microsoft.com",
            "phone": "+91-80-4010-3000"
        }
    },
    {
        "id": 17,
        "name": "Software Technology Parks of India",
        "logo": "/logos/stpi.jpg",
        "location": "Amritsar / Noida / Bengaluru (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Networking"
        ],
        "description": "IT infrastructure support, software exports, incubation & networking",
        "date": "May 9, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Software Technology Parks of India."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@stpi.in",
            "phone": "+91-11-2823-1100"
        }
    },
    {
        "id": 18,
        "name": "JP Infotech",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=jpinfotech.org",
        "location": "Chennai (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software Engineering"
        ],
        "description": "Software development, IT consulting, enterprise solutions",
        "date": "May 2, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at JP Infotech."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@jpinfotech.org",
            "phone": "+91-44-4266-9999"
        }
    },
    {
        "id": 19,
        "name": "Kaashiv InfoTech",
        "logo": "https://www.google.com/s2/favicons?sz=256&domain=kaashivinfotech.com",
        "location": "Chennai (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science"
        ],
        "description": "Software development, AI, IoT, student industrial training",
        "date": "May 2, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Kaashiv InfoTech."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@kaashivinfotech.com",
            "phone": "+91-900-319-3399"
        }
    },
    {
        "id": 20,
        "name": "SLN Technologies",
        "location": "Chennai (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software"
        ],
        "description": "Software solutions, IT services, enterprise applications",
        "date": "May 18, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at SLN Technologies."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@slntechnologies.com",
            "phone": "+91-44-4855-0666"
        }
    },
    {
        "id": 21,
        "name": "VI Micro Systems",
        "location": "Chennai (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Embedded Software"
        ],
        "description": "Embedded systems, software solutions, defense & IT projects",
        "date": "May 15, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at VI Micro Systems."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "marketing@vimicrosystems.com",
            "phone": "+91-44-4358-1999"
        }
    },
    {
        "id": 22,
        "name": "Network Bulls",
        "location": "Gurugram / Noida (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Networking"
        ],
        "description": "Cisco networking, cloud, cybersecurity training & solutions",
        "date": "May 11, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Network Bulls."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@networkbulls.com",
            "phone": "+91-9999-666-555"
        }
    },
    {
        "id": 23,
        "name": "Aptron Solutions",
        "location": "Noida, Uttar Pradesh (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software Engineering"
        ],
        "description": "IT training, software development, cloud computing, networking & cybersecurity",
        "date": "May 18, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Aptron Solutions."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@aptronsolutions.com",
            "phone": "+91-9560-500-666"
        }
    },
    {
        "id": 24,
        "name": "AorBorC Technologies",
        "location": "Bengaluru (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software"
        ],
        "description": "Software development, IT consulting, digital solutions",
        "date": "May 14, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at AorBorC Technologies."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@aorborc.com",
            "phone": "+91-80-4168-2020"
        }
    },
    {
        "id": 25,
        "name": "iHorse Technologies",
        "location": "Bengaluru (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software Engineering"
        ],
        "description": "Software solutions, web & mobile app development, IT services",
        "date": "May 19, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at iHorse Technologies."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@ihorsetech.com",
            "phone": "+91-80-4090-7070"
        }
    },
    {
        "id": 26,
        "name": "Cresendos",
        "location": "Bengaluru (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software"
        ],
        "description": "IT services, software development, enterprise solutions",
        "date": "May 9, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Cresendos Pvt. Ltd.."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@cresendos.com",
            "phone": "+91-80-4203-4500"
        }
    },
    {
        "id": 27,
        "name": "Bharat Sanchar Nigam",
        "location": "Hyderabad / Chennai / Regional Telecom Offices ...",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Networking & Telecom"
        ],
        "description": "Telecom services, networking, data communication, IT infrastructure",
        "date": "May 7, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Bharat Sanchar Nigam Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "cgmt@bsnl.co.in",
            "phone": "+91-172-261-0010"
        }
    },
    {
        "id": 28,
        "name": "IIT Madras Research Park",
        "location": "Chennai, Tamil Nadu (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Research & Innovation"
        ],
        "description": "Technology incubation, software R&D, startups, industry–academia collaboration",
        "date": "May 19, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at IIT Madras Research Park."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@researchpark.iitm.ac.in",
            "phone": "+91-44-2257-8100"
        }
    },
    {
        "id": 29,
        "name": "Virtusa Consulting Services",
        "location": "Chennai / Hyderabad / Bengaluru (India)",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "IT",
            "Computer Science",
            "Software Engineering"
        ],
        "description": "IT consulting, software development, digital engineering",
        "date": "May 7, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Virtusa Consulting Services."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@virtusa.com",
            "phone": "+91-44-4621-7000"
        }
    },
    {
        "id": 30,
        "name": "Hexaware Technologies",
        "location": "Gurugram",
        "discipline": "Computer Science",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Medical",
            "Healthcare"
        ],
        "description": "Multi-speciality hospital & medical research",
        "date": "May 9, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Hexaware Technologies."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "info@medanta.org",
            "phone": "+91-124-4141414"
        }
    },
    {
        "id": 31,
        "name": "Cipla",
        "location": "Delhi NCR",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharma"
        ],
        "description": "Medicines & healthcare products",
        "date": "May 11, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Cipla Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contactus@cipla.com",
            "phone": "+91-22-24826000"
        }
    },
    {
        "id": 32,
        "name": "Hi-Glance Laboratories",
        "location": "Surajpur, Greater Noida (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Industry"
        ],
        "description": "Pharmaceutical manufacturing (tablets, capsules, syrups)",
        "date": "May 8, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Hi-Glance Laboratories Pvt. Ltd.."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@hi-glancelaboratoriespvt.ltd..com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 33,
        "name": "Indian Pharmacopoeial Commission",
        "location": "Ghaziabad, Uttar Pradesh (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Medical",
            "Regulatory Body"
        ],
        "description": "Drug quality standards, testing & regulatory support",
        "date": "May 12, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Indian Pharmacopoeial Commission."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@indianpharmacopoeialcommission.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 34,
        "name": "Mars Therapeutics",
        "location": "Hyderabad, Telangana (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Industry"
        ],
        "description": "Pharmaceutical manufacturing (oral solid dosage forms)",
        "date": "May 9, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Mars Therapeutics Pvt. Ltd.."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@marstherapeuticspvt.ltd..com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 35,
        "name": "Medopharm",
        "location": "Chennai, Tamil Nadu (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Industry"
        ],
        "description": "Pharmaceutical formulations & drug manufacturing",
        "date": "May 17, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Medopharm Private Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@medopharmprivatelimited.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 36,
        "name": "Claroid Pharmaceuticals",
        "location": "Ahmedabad, Gujarat (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Industry"
        ],
        "description": "Pharmaceutical manufacturing & formulation plant",
        "date": "May 20, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Claroid Pharmaceuticals Pvt. Ltd.."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@claroidpharmaceuticalspvt.ltd..com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 37,
        "name": "NuLife Pharmaceuticals",
        "location": "Pune, Maharashtra (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Manufacturing"
        ],
        "description": "Pharmaceutical products (tablets, capsules, liquids)",
        "date": "May 15, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at NuLife Pharmaceuticals."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@nulifepharmaceuticals.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 38,
        "name": "Emmchak Pharmaceutical Company",
        "location": "Tiruchirappalli, Tamil Nadu (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Industry"
        ],
        "description": "Pharmaceutical dosage form manufacturing",
        "date": "May 2, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Emmchak Pharmaceutical Company."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@emmchakpharmaceuticalcompany.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 39,
        "name": "ANOD Pharma",
        "location": "Kanpur, Uttar Pradesh (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Industry"
        ],
        "description": "Pharmaceutical manufacturing, QA & QC operations",
        "date": "May 1, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at ANOD Pharma Pvt. Ltd.."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@anodpharmapvt.ltd..com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 40,
        "name": "Medihauxe Pharma",
        "location": "Kerala (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Medical",
            "Herbal Industry"
        ],
        "description": "Pharmaceutical & herbal medicine manufacturing",
        "date": "May 11, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Medihauxe Pharma Pvt. Ltd.."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@medihauxepharmapvt.ltd..com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 41,
        "name": "Callidus Research Laboratories",
        "location": "Pune, Maharashtra (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Research Industry"
        ],
        "description": "Pharmaceutical research, formulation & analytical R&D",
        "date": "May 4, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Callidus Research Laboratories Pvt. Ltd.."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@callidusresearchlaboratoriespvt.ltd..com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 42,
        "name": "Hetero Drugs",
        "location": "Hyderabad, Telangana (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Industry"
        ],
        "description": "Pharmaceutical manufacturing (APIs, formulations, generics)",
        "date": "May 15, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Hetero Drugs Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@heterodrugslimited.com",
            "phone": "Contact: +91-40-2370-4900"
        }
    },
    {
        "id": 43,
        "name": "Micro Labs",
        "location": "Bengaluru, Karnataka (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Pharmaceutical Industry"
        ],
        "description": "Pharmaceutical formulations & healthcare products",
        "date": "May 13, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Micro Labs Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@microlabslimited.com",
            "phone": "Contact: +91-80-2852-0100"
        }
    },
    {
        "id": 44,
        "name": "Biocon",
        "location": "Bengaluru, Karnataka (India)",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharmacy",
            "Biotechnology",
            "Medical Industry"
        ],
        "description": "Biopharmaceuticals, biosimilars & research",
        "date": "May 3, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Biocon Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@bioconlimited.com",
            "phone": "Contact: +91-80-2808-2808"
        }
    },
    {
        "id": 45,
        "name": "Sun Pharmaceutical Industries",
        "location": "Mumbai, Maharashtra (India)🧾 Pharmaceutical f...",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharma",
            "Medical",
            "Healthcare"
        ],
        "description": "Industrial visit to Sun Pharmaceutical Industries Limited to explore the latest industry standards and workflows.",
        "date": "May 7, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Sun Pharmaceutical Industries Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@sunpharmaceuticalindustrieslimited.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 46,
        "name": "Dr. Reddy’s Laboratories",
        "location": "Hyderabad, Telangana (India)🧾 Generic medicin...",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharma",
            "Medical",
            "Healthcare"
        ],
        "description": "Industrial visit to Dr. Reddy’s Laboratories Limited to explore the latest industry standards and workflows.",
        "date": "May 20, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Dr. Reddy’s Laboratories Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@dr.reddy’slaboratorieslimited.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 47,
        "name": "Aurobindo Pharma",
        "location": "Hyderabad, Telangana (India)🧾 APIs, formulati...",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharma",
            "Medical",
            "Healthcare"
        ],
        "description": "Industrial visit to Aurobindo Pharma Limited to explore the latest industry standards and workflows.",
        "date": "May 10, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Aurobindo Pharma Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@aurobindopharmalimited.com",
            "phone": "+91-0000000000"
        }
    },
    {
        "id": 48,
        "name": "Glenmark Pharmaceuticals",
        "location": "Mumbai, Maharashtra (India)🧾 Pharmaceutical f...",
        "discipline": "Biotechnology",
        "type": "Industrial Visit",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
        "tags": [
            "Pharma",
            "Medical",
            "Healthcare"
        ],
        "description": "Industrial visit to Glenmark Pharmaceuticals Limited to explore the latest industry standards and workflows.",
        "date": "May 17, 2026",
        "requirements": [
            "University ID",
            "Formal Attire"
        ],
        "itinerary": [
            {
                "time": "10:00 AM",
                "title": "Arrival & Welcome",
                "description": "Check-in and introductory presentation at Glenmark Pharmaceuticals Limited."
            },
            {
                "time": "11:00 AM",
                "title": "Facility Tour",
                "description": "Guided walkthrough of the main working areas."
            },
            {
                "time": "01:00 PM",
                "title": "Q&A Session",
                "description": "Interactive session with industry professionals."
            }
        ],
        "representative": {
            "name": "HR / Coordinator",
            "role": "University Relations",
            "email": "contact@glenmarkpharmaceuticalslimited.com",
            "phone": "+91-0000000000"
        }
    }
];

export const getCompanies = async (): Promise<Company[]> => {
    const { data, error } = await supabase.from('companies').select('*')
    if (error) {
        console.error('Error fetching companies:', error)
        return COMPANIES
    }
    if (!data || data.length === 0) return COMPANIES
    
    // Merge Supabase data with local fallback correctly
    return data.map((dbCompany: any) => {
        const localCompany = COMPANIES.find(c => c.name === dbCompany.name)
        return {
            ...localCompany,
            ...dbCompany,
            logo: dbCompany.logo || localCompany?.logo 
        }
    }) as Company[]
}

export const getCompanyById = async (id: number): Promise<Company | undefined> => {
    const { data, error } = await supabase.from('companies').select('*').eq('id', id).single()
    if (error) {
        console.error('Error fetching company:', error)
        return COMPANIES.find(c => c.id === id)
    }
    
    const localCompany = COMPANIES.find(c => c.name === data.name)
    return {
        ...localCompany,
        ...data,
        logo: data.logo || localCompany?.logo
    } as Company
}
