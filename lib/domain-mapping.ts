export function resolveInstitutionFromEmail(email: string | undefined | null): string {
    if (!email) return "University / Educational Institution"
    
    // Normalize string
    email = email.toLowerCase().trim()
    if (!email.includes("@")) return "University / Educational Institution"
    
    const domain = email.split("@")[1]
    
    // 1. Core Enterprise Registry (Exact matches)
    const registry: Record<string, string> = {
        "krmangalam.edu.in": "K.R. Mangalam University",
        "krmu.edu.in": "K.R. Mangalam University",
        "stanford.edu": "Stanford University",
        "mit.edu": "Massachusetts Institute of Technology",
        "harvard.edu": "Harvard University",
        "iitd.ac.in": "Indian Institute of Technology Delhi",
        "iitb.ac.in": "Indian Institute of Technology Bombay",
        "iitk.ac.in": "Indian Institute of Technology Kanpur",
        "iitm.ac.in": "Indian Institute of Technology Madras",
        "cam.ac.uk": "University of Cambridge",
        "ox.ac.uk": "University of Oxford",
        "berkeley.edu": "UC Berkeley",
        // Fallbacks for testing
        "gmail.com": "Independent Researcher",
        "demo.com": "UniVisit Demo Institution"
    }

    if (registry[domain]) {
        return registry[domain]
    }

    // 2. Advanced Dynamic Resolution (Unknown domains)
    // E.g. 'jsmith@faculty.cs.amity.edu.in' -> 'Amity University'
    const parts = domain.split(".")
    
    // Common Top/Second Level Academic domains to strip
    const ignoreList = new Set(['edu', 'ac', 'in', 'us', 'uk', 'au', 'ca', 'co', 'com', 'org', 'net', 'student', 'alum', 'faculty', 'mail'])
    
    // Scan backwards to find the main organization block
    let orgName = ""
    for (let i = parts.length - 1; i >= 0; i--) {
        if (!ignoreList.has(parts[i])) {
            orgName = parts[i]
            break
        }
    }
    
    if (orgName) {
        // If it's short, it's likely an acronym (e.g. 'mit', 'nvu')
        if (orgName.length <= 4) {
            return `${orgName.toUpperCase()} University`
        }
        
        // Otherwise, format nicely (e.g. 'amity' -> 'Amity University')
        const titleCased = orgName.charAt(0).toUpperCase() + orgName.slice(1).toLowerCase()
        return `${titleCased} University`
    }
    
    return "University / Educational Institution"
}

export function isEmailAuthorized(email: string | undefined | null): boolean {
    if (!email) return false;
    const domain = email.toLowerCase().trim().split("@")[1];
    if (!domain) return false;

    // Strict Domain Blocking: Reject known public consumer domains
    const genericDomains = new Set([
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
        'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
        'live.com', 'msn.com', 'ymail.com'
    ]);

    if (genericDomains.has(domain)) {
        // Exception for explicit demo/testing registry entries if needed
        // but for enterprise security, public domains are blocked.
        return false;
    }

    // Enterprise Heuristic: ensure it has a valid academic/organizational TLD
    // For example, .edu, .ac.in, or mapped explicitly in our registry.
    // If it's a completely arbitrary domain not in registry, we could block it, 
    // but allowing non-generics gives flexibility for obscure institutions.
    return true;
}

export function extractRollNumberFromEmail(email: string | undefined | null): string {
    if (!email) return ""
    // Extract numbers continuously from the local-part (before @)
    const localPart = email.split('@')[0]
    // Use regex to find continuous blocks of digits (e.g. vikrant2301010028 -> 2301010028)
    const matches = localPart.match(/\d+/g)
    if (matches && matches.length > 0) {
        // Return the longest numeric match as it's typically the true core roll number
        return matches.reduce((a, b) => a.length > b.length ? a : b)
    }
    return ""
}

export function determineRoleFromEmail(email: string | undefined | null): 'student' | 'faculty' {
    if (!email) return 'faculty';
    
    const parts = email.toLowerCase().trim().split("@");
    if (parts.length < 2) return 'faculty';
    
    const domain = parts[1];

    // Explicit Enterprise Domain Routing for K.R. Mangalam
    // Staff/Faculty use @krmangalam.edu.in
    if (domain === 'krmangalam.edu.in') {
        return 'faculty';
    }
    
    // Students natively use @krmu.edu.in
    if (domain === 'krmu.edu.in') {
        return 'student';
    }

    // Dynamic Fallback Heuristic
    // If domain isn't explicitly known, fall back to checking if the prefix contains a roll number
    const rollNumber = extractRollNumberFromEmail(email);
    return rollNumber ? 'student' : 'faculty';
}

export const UNIVERSITY_TAXONOMY: Record<string, { degrees: string[], departments: string[], sections: string[] }> = {
    "K.R. Mangalam University": {
        degrees: [
            "Bachelor of Technology (B.Tech)",
            "Master of Technology (M.Tech)",
            "Bachelor of Business Administration (BBA)",
            "Master of Business Administration (MBA)",
            "Bachelor of Computer Applications (BCA)",
            "Master of Computer Applications (MCA)",
            "Bachelor of Science (B.Sc) (Hons.)",
            "Master of Science (M.Sc)",
            "Bachelor of Architecture (B.Arch)",
            "Bachelor of Pharmacy (B.Pharm)",
            "Bachelor of Design (B.Des)",
            "Bachelor of Arts (B.A) (Hons.)",
            "Bachelor of Commerce (B.Com) (Hons.)",
            "Bachelor of Laws (LLB)"
        ],
        departments: [
            "School of Engineering and Technology",
            "School of Management and Commerce",
            "School of Basic and Applied Sciences",
            "School of Humanities and Social Sciences",
            "School of Legal Studies",
            "School of Medical and Allied Sciences",
            "School of Architecture and Planning",
            "School of Education",
            "School of Journalism and Mass Communication"
        ],
        sections: ["A", "B", "C", "D", "E"]
    },
    "Indian Institute of Technology Delhi": {
        degrees: ["B.Tech", "M.Tech", "Ph.D", "B.Des"],
        departments: ["Computer Science and Engineering", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
        sections: ["G1", "G2", "G3", "G4"]
    },
    "DEFAULT": {
        degrees: [
            "Undergraduate Degree (Bachelor's)",
            "Postgraduate Degree (Master's)",
            "Doctorate (Ph.D.)",
            "Diploma"
        ],
        departments: [
            "Computer Science & IT",
            "Engineering",
            "Business & Management",
            "Science & Mathematics",
            "Arts & Humanities",
            "Medical & Health Sciences"
        ],
        sections: ["A", "B", "C", "Standard"]
    }
}

export function getInstitutionOptions(institution: string | null | undefined) {
    if (institution && UNIVERSITY_TAXONOMY[institution]) {
        return UNIVERSITY_TAXONOMY[institution]
    }
    return UNIVERSITY_TAXONOMY["DEFAULT"]
}
