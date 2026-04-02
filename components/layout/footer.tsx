
import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Left: CodeX Branding */}
                <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
                    <span className="text-slate-600 font-medium text-[13px]">© 2025. All rights reserved.</span>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-800 hidden md:inline">/</span>
                        <span className="text-slate-400 text-[13px] font-medium tracking-wide flex items-baseline gap-1.5">
                            Engineered by
                            <span className="text-slate-200 transition-colors duration-300 hover:text-blue-600 cursor-default text-xl font-bold tracking-wide relative top-[2px]" style={{ fontFamily: 'var(--font-dancing)', textShadow: '0.5px 0 0 currentColor' }}>
                                CodeX Team.
                            </span>
                        </span>
                    </div>
                </div>

                {/* Right: Social Actions */}
                <div className="flex items-center gap-7">
                    <SocialIcon href="#" label="Github" color="hover:text-white">
                        <Github className="w-[22px] h-[22px]" />
                    </SocialIcon>
                    <SocialIcon href="#" label="Twitter" color="hover:text-[#0EA5E9]">
                        <Twitter className="w-[22px] h-[22px]" />
                    </SocialIcon>
                    <SocialIcon href="#" label="LinkedIn" color="hover:text-[#0077B5]">
                        <Linkedin className="w-[22px] h-[22px]" />
                    </SocialIcon>
                    <SocialIcon href="#" label="Email" color="hover:text-emerald-500">
                        <Mail className="w-[22px] h-[22px]" />
                    </SocialIcon>
                </div>

            </div>
        </footer>
    )
}

function SocialIcon({ children, href, label, color }: { children: React.ReactNode, href: string, label: string, color: string }) {
    return (
        <Link
            href={href}
            aria-label={label}
            className={`text-slate-500 transition-all duration-300 hover:scale-110 ${color}`}
        >
            {children}
        </Link>
    )
}
