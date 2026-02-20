export interface Company {
    id: number
    name: string
    location: string
    discipline: string
    image: string
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

import { supabase } from "./supabase"

export const COMPANIES: Company[] = [
    {
        id: 1,
        name: "Tesla Gigafactory",
        location: "Austin, Texas",
        discipline: "Mechanical Engineering",
        type: "Manufacturing Hub",
        image: "https://images.unsplash.com/photo-1565514020176-db9318b76dfd?q=80&w=600&auto=format&fit=crop",
        tags: ["Robotics", "Automation", "Mechatronics"],
        description: "Witness the advanced robotics system and assembly line efficiency of the Model Y production. Students will observe the Giga Press in action and understand the vertically integrated manufacturing process.",
        date: "April 12, 2026",
        requirements: ["Closed-toe shoes", "Long pants", "University ID", "NDA Signature"],
        itinerary: [
            { time: "10:00 AM", title: "Safety Briefing", description: "Mandatory safety gear distribution and protocol overview." },
            { time: "11:00 AM", title: "General Assembly Tour", description: "Walkthrough of the main production line observing robotics integration." },
            { time: "12:30 PM", title: "Lunch with Engineers", description: "Networking session with production engineers." },
            { time: "02:00 PM", title: "Q&A Session", description: "Open floor for technical questions regarding manufacturing challenges." }
        ],
        representative: {
            name: "Sarah Connor",
            role: "Lead Automation Engineer",
            email: "s.connor@tesla.com",
            phone: "+1 (512) 555-0123"
        }
    },
    {
        id: 2,
        name: "Boston Dynamics",
        location: "Waltham, MA",
        discipline: "Computer Science",
        type: "R&D Lab",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop",
        tags: ["AI", "Control Systems", "Kinematics"],
        description: "Explore state-of-the-art dynamic robotics. See Spot and Atlas in action and learn about the control algorithms that enable their agility and balance.",
        date: "May 18, 2026",
        requirements: ["University ID", "No Photography", "Safety Glasses (Provided)"],
        itinerary: [
            { time: "09:00 AM", title: "Welcome Presentation", description: "Overview of Boston Dynamics history and mission." },
            { time: "10:00 AM", title: "Demo: Spot & Atlas", description: "Live demonstration of mobile robot capabilities." },
            { time: "11:30 AM", title: "Control Systems Workshop", description: "Deep dive into the software stack powering the robots." },
            { time: "01:00 PM", title: "Lab Tour", description: "Walkthrough of the testing facilities." }
        ],
        representative: {
            name: "Dr. Marc Raibert",
            role: "Research Director",
            email: "visits@bostondynamics.com",
            phone: "+1 (617) 555-0199"
        }
    },
    {
        id: 3,
        name: "NVIDIA Computing Center",
        location: "Santa Clara, CA",
        discipline: "Computer Science",
        type: "Data Center",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
        tags: ["Hardware", "ML Infrastructure", "GPUs"],
        description: "Tour the infrastructure powering the AI revolution. Understand the architecture of high-performance computing clusters and cooling systems.",
        date: "May 30, 2026",
        requirements: ["Government ID", "Security Clearance Check (On-site)", "No Electronics"],
        itinerary: [
            { time: "10:00 AM", title: "Security Check-in", description: "Badge issuance and security protocols." },
            { time: "11:00 AM", title: "Data Center Floor", description: "Guided walk through the server aisles." },
            { time: "12:30 PM", title: "Architecture Talk", description: "Lecture by a Systems Architect on GPU interconnects." },
            { time: "02:00 PM", title: "Exit Procedures", description: "Badge return and debrief." }
        ],
        representative: {
            name: "Jensen Huang",
            role: "System Architecture Lead",
            email: "outreach@nvidia.com",
            phone: "+1 (408) 555-0100"
        }
    },
    {
        id: 4,
        name: "Oracle Cloud Campus",
        type: "Corporate HQ",
        location: "Austin, TX",
        capacity: 40,
        discipline: "Computer Science",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop",
        tags: ["Cloud Infrastructure", "Database Systems"],
        description: "Visit the hub of enterprise cloud computing. Learn about database scalability, cloud reliability engineering, and enterprise software cycles.",
        date: "April 22, 2026",
        requirements: ["Business Casual Attire", "Laptop (Optional for Workshop)"],
        itinerary: [
            { time: "09:30 AM", title: "Campus Tour", description: "Tour of the amenities and collaborative workspaces." },
            { time: "10:30 AM", title: "Cloud Engineering Panel", description: "Q&A with the OCI team." },
            { time: "12:00 PM", title: "Networking Lunch", description: "Lunch at the campus cafeteria." },
            { time: "01:30 PM", title: "Database Workshop", description: "Hands-on session with Oracle DB tools." }
        ],
        representative: {
            name: "Larry Ellison",
            role: "University Relations Manager",
            email: "uni.relations@oracle.com",
            phone: "+1 (737) 555-0155"
        }
    },
    {
        id: 5,
        name: "SpaceX Launch Facility",
        type: "R&D Lab",
        location: "Boca Chica, TX",
        capacity: 25,
        discipline: "Mechanical Engineering",
        image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=300&auto=format&fit=crop",
        tags: ["Aerospace", "Propulsion"],
        description: "A rare look inside Starbase. Observe the assembly of the Starship launch vehicle and learn about reusable rocket technology.",
        date: "June 15, 2026",
        requirements: ["US Person Status (ITAR)", "Steel-toed Boots", "Long Sleeves"],
        itinerary: [
            { time: "08:00 AM", title: "Gate Check", description: "Strict security verification." },
            { time: "09:00 AM", title: "High Bay Tour", description: "View of the Starship assembly." },
            { time: "11:00 AM", title: "Propulsion Talk", description: "Discussion on Raptor engine mechanics." },
            { time: "01:00 PM", title: "Launch Pad View", description: "Bus tour to the launch mount." }
        ],
        representative: {
            name: "Gwynne Shotwell",
            role: "Operations Coordinator",
            email: "starbase.visits@spacex.com",
            phone: "+1 (956) 555-0190"
        }
    },
    {
        id: 6,
        name: "Pfizer Research Hub",
        type: "Medical Lab",
        location: "Cambridge, MA",
        capacity: 20,
        discipline: "Biotechnology",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=300&auto=format&fit=crop",
        tags: ["Pharmaceuticals", "Genetics"],
        description: "Explore state-of-the-art CRISPR technology and drug discovery workflows. Understand the journey from molecule to medicine.",
        date: "May 25, 2026",
        requirements: ["Lab Coat (Provided)", "Closed-toe Shoes", "No Contact Lenses"],
        itinerary: [
            { time: "09:00 AM", title: "Safety Induction", description: "Biosafety Level protocols." },
            { time: "10:00 AM", title: "Genomics Lab", description: "Observation of sequencing machines." },
            { time: "11:30 AM", title: "Cheminformatics Demo", description: "Software tools for drug design." },
            { time: "01:00 PM", title: "Scientist Roundtable", description: "Career discussion with researchers." }
        ],
        representative: {
            name: "Dr. Albert Bourla",
            role: "Principal Investigator",
            email: "research.outreach@pfizer.com",
            phone: "+1 (857) 555-0140"
        }
    },
    {
        id: 7,
        name: "Google Bay View",
        type: "Innovation Center",
        location: "Mountain View, CA",
        capacity: 50,
        discipline: "Computer Science",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=300&auto=format&fit=crop",
        tags: ["Search Algorithms", "AI Analysis"],
        description: "Detailed tour of Google's sustainability-focused campus. Discussions on large-scale distributed systems and AI ethics.",
        date: "June 05, 2026",
        requirements: ["Visitor Badge Preregistration", "Photo ID"],
        itinerary: [
            { time: "10:00 AM", title: "Welcome Center", description: "Campus architecture and sustainability tour." },
            { time: "11:30 AM", title: "Tech Talk: Gemini", description: "Presentation on the latest AI models." },
            { time: "12:30 PM", title: "Lunch", description: "World-famous Google food experience." },
            { time: "02:00 PM", title: "Campus Walk", description: "Free time to explore the grounds." }
        ],
        representative: {
            name: "Sundar Pichai",
            role: "Campus Programs Lead",
            email: "bayview.visits@google.com",
            phone: "+1 (650) 555-0188"
        }
    },
    {
        id: 8,
        name: "BMW Assembly Plant",
        type: "Manufacturing",
        location: "Spartanburg, SC",
        capacity: 60,
        discipline: "Mechanical Engineering",
        image: "https://images.unsplash.com/photo-1626244243673-c40217ec827d?q=80&w=300&auto=format&fit=crop",
        tags: ["Automotive", "Robotics"],
        description: "Observe the complete assembly process of the X-Series vehicles. Focus on supply chain logistics and robotic welding cells.",
        date: "April 28, 2026",
        requirements: ["Safety Vest (Provided)", "Leggings/Jeans", "Ear Plugs (Provided)"],
        itinerary: [
            { time: "09:00 AM", title: "Museum Tour", description: "History of BMW manufacturing." },
            { time: "10:30 AM", title: "Body Shop", description: "Robotic welding and frame assembly." },
            { time: "12:00 PM", title: "Paint Shop Overview", description: "Explanation of the painting process." },
            { time: "01:30 PM", title: "Final Assembly", description: "The marriage of chassis and body." }
        ],
        representative: {
            name: "Oliver Zipse",
            role: "Plant Operations Manager",
            email: "plant.tours@bmwgroup.com",
            phone: "+1 (864) 555-0133"
        }
    }
]

export const getCompanies = async (): Promise<Company[]> => {
    const { data, error } = await supabase.from('companies').select('*')
    if (error) {
        console.error('Error fetching companies:', error)
        return COMPANIES
    }
    // Type assertion or mapping might be needed if DB schema differs from Company interface slightly (e.g. JSON fields)
    if (!data || data.length === 0) return COMPANIES

    // Map JSONB fields back if necessary (Supabase returns JSON as object, which matches interface mostly)
    return data as any as Company[]
}

export const getCompanyById = async (id: number): Promise<Company | undefined> => {
    const { data, error } = await supabase.from('companies').select('*').eq('id', id).single()
    if (error) {
        console.error(`Error fetching company ${id}:`, error)
        return COMPANIES.find(c => c.id === id)
    }
    return data as any as Company
}
