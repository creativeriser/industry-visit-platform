import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  Cpu,
  Cog,
  FlaskConical,
  Briefcase,
  Construction,
  Zap,
  DraftingCompass, // Check imports, DraftingCompass might need replacing if not in generic lucide set, using generic if fails
  Building2,
  Plane,
  Microscope,
  Pill,
  Scale,
  Palette,
  LucideIcon
} from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDisciplineIcon(discipline: string) {
  const map: Record<string, LucideIcon> = {
    "Computer Science": Cpu,
    "Mechanical Eng.": Cog,
    "Chemical Eng.": FlaskConical,
    "Business Admin": Briefcase,
    "Civil Eng.": Construction,
    "Electrical Eng.": Zap,
    "Architecture": DraftingCompass,
    "Aerospace": Plane,
    "Biotechnology": Microscope,
    "Pharmacy": Pill,
    "Law": Scale,
    "Design": Palette
  }
  return map[discipline] || Building2
}
