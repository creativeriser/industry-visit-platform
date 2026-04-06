"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { 
    BookOpen, 
    Cpu, 
    Edit2, 
    User, 
    Mail, 
    Phone, 
    Building2, 
    Github, 
    Linkedin, 
    Code,
    Save,
    Loader2,
    FileText,
    Award,
    Plus,
    Trash2,
    Check,
    X,
    ExternalLink
} from "lucide-react"
import { getInstitutionOptions } from "@/lib/domain-mapping"
import { PdfViewer } from "@/components/ui/pdf-viewer"
import { COMPANIES } from "@/lib/companies"

const SaveControls = ({ mode, currentMode, onSave, onCancel, saving }: any) => {
    if (currentMode !== mode) return null;
    return (
        <div className="flex items-center gap-1.5 ml-2 -mr-1">
            <button 
                onClick={onCancel} 
                disabled={saving}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-md transition-colors"
                title="Cancel"
            >
                <X className="w-3.5 h-3.5" />
            </button>
            <button 
                onClick={onSave} 
                disabled={saving}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-200/60 rounded-md transition-colors font-bold text-[10px] uppercase tracking-wider relative overflow-hidden"
                title="Save Changes"
            >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin aspect-square" /> : <><Check className="w-3.5 h-3.5" /> Save</>}
            </button>
        </div>
    );
};

export default function StudentProfilePage() {
    const { user } = useAuth()
    const [editMode, setEditMode] = useState<string>('none')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const isEditingPersonal = editMode === 'personal'
    const isEditingAcademic = editMode === 'academic'
    const isEditingGithub = editMode === 'github'
    const isEditingLinkedin = editMode === 'linkedin'
    const isEditingLeetcode = editMode === 'leetcode'
    const isEditingResume = editMode === 'resume'
    const isEditingCertificates = editMode === 'certificates'

    const [profile, setProfile] = useState<any>({
        full_name: "",
        email: "",
        phone: "",
        institution: "",
        degree: "",
        department: "",
        roll_number: "",
        section: "",
        cgpa: "",
        attendance: "",
        discipline: "",
        github_url: "",
        linkedin_url: "",
        leetcode_url: "",
        resume_url: "",
        certificates: []
    })

    const [tempData, setTempData] = useState<any>({})
    const [githubData, setGithubData] = useState<any>(null)
    const [leetcodeData, setLeetcodeData] = useState<any>(null)

    const [validGithub, setValidGithub] = useState<boolean>(false)
    const [validLeetcode, setValidLeetcode] = useState<boolean>(false)
    const [validLinkedin, setValidLinkedin] = useState<boolean>(false)

    useEffect(() => {
        const fetchLeetcode = async () => {
            setLeetcodeData(null)
            setValidLeetcode(false)
            if (profile?.leetcode_url) {
                // Must extract exact path segment before any ? or /
                const match = profile.leetcode_url.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([^/?#]+)/i)
                const username = match ? match[1].toLowerCase().trim() : null
                
                // Professional enterprise exclusion filter to prevent interpreting default site pages as usernames
                const reservedPaths = ['problemset', 'explore', 'contest', 'discuss', 'store', 'interview', 'assessment', 'studyplan', 'problems', 'premium', 'jobs', 'login', 'signup']
                
                if (username && !reservedPaths.includes(username)) {
                    try {
                        const res = await fetch(`/api/leetcode?username=${username}`)
                        if (res.ok) {
                            setLeetcodeData(await res.json())
                            setValidLeetcode(true)
                        }
                    } catch (e) {}
                }
            }
        }
        fetchLeetcode()
    }, [profile?.leetcode_url])

    useEffect(() => {
        if (user) {
            supabase.from('profiles').select('*').eq('id', user.id).single()
                .then(({ data }) => {
                    if (data) {
                        const loaded = {
                            full_name: data.full_name || "",
                            email: data.email || user.email || "",
                            phone: data.phone || "",
                            institution: data.school || data.institution || "",
                            degree: data.degree || "",
                            department: data.department || "",
                            roll_number: data.roll_number || "",
                            section: data.section || "",
                            cgpa: data.cgpa ? String(data.cgpa) : "",
                            attendance: data.attendance || "",
                            discipline: data.discipline || "",
                            github_url: data.github_url || "",
                            linkedin_url: data.linkedin_url || "",
                            leetcode_url: data.leetcode_url || "",
                            resume_url: data.resume_url || "",
                            certificates: data.certificates || []
                        }
                        setProfile(loaded)
                        setTempData(loaded)
                    }
                    setLoading(false)
                })
        }
    }, [user])

    useEffect(() => {
        const fetchGitHub = async () => {
            setGithubData(null)
            setValidGithub(false)
            if (profile?.github_url) {
                // Must extract exact path segment before any ? or /
                const match = profile.github_url.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#]+)/i)
                const username = match ? match[1].toLowerCase().trim() : null
                
                // Professional enterprise exclusion filter to prevent interpreting default site pages as usernames
                const reservedPaths = ['explore', 'pulls', 'issues', 'topics', 'trending', 'pricing', 'features', 'enterprise', 'settings', 'search', 'orgs', 'about', 'dashboard', 'notifications', 'login', 'join']
                
                if (username && !reservedPaths.includes(username)) {
                    try {
                        const res = await fetch(`/api/github?username=${username}`)
                        if (res.ok) {
                            setGithubData(await res.json())
                            setValidGithub(true)
                        }
                    } catch (e) {}
                }
            }
        }
        fetchGitHub()
    }, [profile?.github_url])

    useEffect(() => {
        if (profile?.linkedin_url) {
            const isValid = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([^/]+)/i.test(profile.linkedin_url)
            setValidLinkedin(isValid)
        } else {
            setValidLinkedin(false)
        }
    }, [profile?.linkedin_url])

    const handleSave = async () => {
        if (!user) return
        setSaving(true)

        // Validation Logic
        if (tempData.cgpa) {
            const cgpaVal = parseFloat(tempData.cgpa);
            if (isNaN(cgpaVal) || cgpaVal < 0.0 || cgpaVal > 10.0) {
                alert("Invalid CGPA. Must be between 0.0 and 10.0");
                setSaving(false);
                return;
            }
        }

        if (tempData.attendance) {
            const attVal = parseFloat(tempData.attendance);
            if (isNaN(attVal) || attVal < 0 || attVal > 100) {
                alert("Invalid Attendance. Must be between 0 and 100");
                setSaving(false);
                return;
            }
        }
        
        const { error } = await supabase.from('profiles').update({
            full_name: tempData.full_name || null,
            phone: tempData.phone || null,
            degree: tempData.degree || null,
            department: tempData.department || null,
            roll_number: tempData.roll_number || null,
            section: tempData.section || null,
            cgpa: tempData.cgpa ? parseFloat(tempData.cgpa) : null,
            attendance: tempData.attendance ? parseFloat(tempData.attendance) : null,
            discipline: tempData.discipline || null,
            github_url: tempData.github_url || null,
            linkedin_url: tempData.linkedin_url || null,
            leetcode_url: tempData.leetcode_url || null,
            resume_url: tempData.resume_url || null,
            certificates: tempData.certificates || []
        }).eq('id', user.id)

        if (error) {
            console.error("Supabase Update Error:", error)
            alert("Database Error: " + error.message)
            setSaving(false)
            return
        }

        setProfile(tempData)
        setSaving(false)
        setEditMode('none')
    }

    const getCgpaTheme = (cgpa: string) => {
        const val = parseFloat(cgpa)
        if (isNaN(val)) return "emerald"
        return val >= 8.0 ? "emerald" : "amber"
    }

    const getAttendanceTheme = (att: string) => {
        const val = parseFloat(att)
        if (isNaN(val)) return "emerald"
        return val >= 75 ? "emerald" : "amber"
    }

    if (loading) return null

    const activeTaxonomy = getInstitutionOptions(profile.institution)
    const availableDisciplines = Array.from(new Set(COMPANIES.map(c => c.discipline))).sort()

    return (
        <div className="h-full overflow-y-auto w-full">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-10 space-y-8 pb-32">
                
                {/* Enterprise Header Card  */}
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full">
                        {/* Avatar */}
                        <div className="relative group shrink-0">
                            <div className="h-28 w-28 rounded-full ring-4 ring-slate-50 shadow-sm flex items-center justify-center text-[32px] font-bold text-[#0c4a6e] bg-[#f0f9ff] border border-sky-100/50">
                                {profile.full_name ? profile.full_name.split(' ').map((n:string)=>n[0]).join('').substring(0,2).toUpperCase() : "VS"}
                            </div>
                        </div>

                        {/* Title & Organization Details */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-0 pt-1">
                            <h1 className="text-[28px] leading-tight font-bold text-slate-900 truncate">{profile.full_name || "Student User"}</h1>
                            <p className="text-slate-500 font-medium text-[15px] truncate w-full mt-2 flex items-center justify-center md:justify-start gap-2">
                                <BookOpen className="w-[18px] h-[18px] text-slate-400" /> Student <span className="text-slate-300 text-xs mx-0.5">•</span> {profile.institution || "Institution Not Set"}
                            </p>
                            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#f0f9ff] text-[#0ea5e9] rounded-lg text-xs font-bold border border-sky-100/50">
                                <Cpu className="w-3.5 h-3.5" />
                                {profile.discipline || "Target Discipline Not Set"}
                            </div>
                        </div>
                    </div>

                    {/* Granular isolation mode fully governs components */}
                </div>

                {/* Grid Layout for Personal and Academic */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Personal Information */}
                    <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2.5">
                                <User className="w-[18px] h-[18px] text-[#0ea5e9]" /> Personal Information
                            </h2>
                            {!isEditingPersonal && (
                                <button onClick={() => setEditMode('personal')} className="p-1 -m-1 text-slate-400 hover:text-sky-600 transition-colors" title="Edit Personal Information">
                                    <Edit2 className="w-[14px] h-[14px]"/>
                                </button>
                            )}
                            <SaveControls mode="personal" currentMode={editMode} onSave={handleSave} onCancel={() => {setTempData(profile); setEditMode('none')}} saving={saving} />
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Full Name <span className="text-red-400">*</span></label>
                                {isEditingPersonal ? (
                                    <input 
                                        value={tempData.full_name || ""} 
                                        onChange={e => setTempData({...tempData, full_name: e.target.value})}
                                        className="w-full p-3.5 rounded-xl border border-sky-500 bg-white ring-2 ring-sky-50 text-slate-900 text-sm font-medium outline-none transition-all" 
                                    />
                                ) : (
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium flex items-center h-[46px]">
                                        {profile.full_name || <span className="text-slate-400">Requires Input</span>}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Student Email <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <div className="w-full pl-11 p-3.5 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-600 text-sm font-medium flex items-center justify-between cursor-not-allowed opacity-90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] h-[46px]">
                                        {profile.email}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Phone Number <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isEditingPersonal ? 'text-slate-500' : 'text-slate-400'}`} />
                                    {isEditingPersonal ? (
                                        <input 
                                            value={tempData.phone || ""} 
                                            onChange={e => setTempData({...tempData, phone: e.target.value})}
                                            className="w-full pl-11 p-3.5 rounded-xl border border-sky-500 bg-white ring-2 ring-sky-50 text-slate-900 text-sm font-medium outline-none transition-all" 
                                        />
                                    ) : (
                                        <div className="w-full pl-11 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium flex items-center h-[46px]">
                                            {profile.phone || <span className="text-slate-400">Requires Input</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Profile */}
                    <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2.5">
                                <Building2 className="w-[18px] h-[18px] text-[#0ea5e9]" /> Academic Profile
                            </h2>
                            {!isEditingAcademic && (
                                <button onClick={() => setEditMode('academic')} className="p-1 -m-1 text-slate-400 hover:text-sky-600 transition-colors" title="Edit Academic Profile">
                                    <Edit2 className="w-[14px] h-[14px]"/>
                                </button>
                            )}
                            <SaveControls mode="academic" currentMode={editMode} onSave={handleSave} onCancel={() => {setTempData(profile); setEditMode('none')}} saving={saving} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Institution <span className="text-red-400">*</span></label>
                                <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-700 text-sm font-bold flex items-center justify-between cursor-not-allowed opacity-90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] h-[46px]" title="Auto-resolved from Email Domain">
                                    {profile.institution || "University Not Set"}
                                </div>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Degree <span className="text-red-400">*</span></label>
                                {isEditingAcademic ? (
                                    <select 
                                        value={tempData.degree || ""} 
                                        onChange={e => setTempData({...tempData, degree: e.target.value})}
                                        className="w-full p-3.5 rounded-xl border border-sky-500 bg-white ring-2 ring-sky-50 text-slate-900 text-sm font-medium outline-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Degree</option>
                                        {activeTaxonomy.degrees.map((d:string) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                ) : (
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium flex items-center h-[46px]">
                                        {profile.degree || <span className="text-slate-400">Requires Input</span>}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Department <span className="text-red-400">*</span></label>
                                {isEditingAcademic ? (
                                    <select 
                                        value={tempData.department || ""} 
                                        onChange={e => setTempData({...tempData, department: e.target.value})}
                                        className="w-full p-3.5 rounded-xl border border-sky-500 bg-white ring-2 ring-sky-50 text-slate-900 text-sm font-medium outline-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Department</option>
                                        {activeTaxonomy.departments.map((d:string) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                ) : (
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium truncate flex items-center h-[46px]">
                                        {profile.department || <span className="text-slate-400">Requires Input</span>}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Roll Number <span className="text-red-400">*</span></label>
                                {isEditingAcademic ? (
                                    <input 
                                        value={tempData.roll_number || ""} 
                                        onChange={e => setTempData({...tempData, roll_number: e.target.value})}
                                        className="w-full p-3.5 rounded-xl border border-sky-500 bg-white ring-2 ring-sky-50 text-slate-900 text-sm font-medium outline-none" 
                                    />
                                ) : (
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium flex items-center h-[46px]">
                                        {profile.roll_number || <span className="text-slate-400">Requires Input</span>}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Section <span className="text-red-400">*</span></label>
                                {isEditingAcademic ? (
                                    <select 
                                        value={tempData.section || ""} 
                                        onChange={e => setTempData({...tempData, section: e.target.value})}
                                        className="w-full p-3.5 rounded-xl border border-sky-500 bg-white ring-2 ring-sky-50 text-slate-900 text-sm font-medium outline-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Section</option>
                                        {activeTaxonomy.sections.map((s:string) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                ) : (
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium flex items-center h-[46px]">
                                        {profile.section || <span className="text-slate-400">N/A</span>}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${getCgpaTheme(isEditingAcademic ? tempData.cgpa : profile.cgpa) === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`}>CGPA <span className="text-red-400">*</span></label>
                                {isEditingAcademic ? (
                                    <input 
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        value={tempData.cgpa || ""} 
                                        onChange={e => setTempData({...tempData, cgpa: e.target.value})}
                                        className={`w-full p-3.5 rounded-xl border ring-2 bg-white text-sm font-bold text-center outline-none transition-all ${getCgpaTheme(tempData.cgpa) === 'emerald' ? 'border-emerald-400 ring-emerald-50 text-emerald-600 placeholder:text-emerald-400/50' : 'border-amber-400 ring-amber-50 text-amber-600 placeholder:text-amber-400/50'}`} 
                                        placeholder="0.00 - 10.00"
                                    />
                                ) : (
                                    <div className={`w-full p-3.5 rounded-xl border text-sm font-bold text-center h-[46px] flex items-center justify-center ${getCgpaTheme(profile.cgpa) === 'emerald' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                                        {profile.cgpa ? `${parseFloat(profile.cgpa).toFixed(2)}` : <span className="opacity-50">REQUIRED</span>}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${getAttendanceTheme(isEditingAcademic ? tempData.attendance : profile.attendance) === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`}>% ATTENDANCE <span className="text-red-400">*</span></label>
                                {isEditingAcademic ? (
                                    <input 
                                        type="number"
                                        step="1"
                                        min="0"
                                        max="100"
                                        value={tempData.attendance || ""} 
                                        onChange={e => setTempData({...tempData, attendance: e.target.value})}
                                        className={`w-full p-3.5 rounded-xl border ring-2 bg-white text-sm font-bold text-center outline-none transition-all ${getAttendanceTheme(tempData.attendance) === 'emerald' ? 'border-emerald-400 ring-emerald-50 text-emerald-600 placeholder:text-emerald-400/50' : 'border-amber-400 ring-amber-50 text-amber-600 placeholder:text-amber-400/50'}`} 
                                        placeholder="0 - 100"
                                    />
                                ) : (
                                    <div className={`w-full p-3.5 rounded-xl border text-sm font-bold text-center h-[46px] flex items-center justify-center ${getAttendanceTheme(profile.attendance) === 'emerald' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                                        {profile.attendance ? `${Math.round(parseFloat(profile.attendance))}%` : <span className="opacity-50">REQUIRED</span>}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-2 space-y-2 pt-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Academic Discipline <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <Cpu className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isEditingAcademic ? 'text-[#0ea5e9]' : 'text-[#38bdf8]'}`} />
                                    {isEditingAcademic ? (
                                        <select 
                                            value={tempData.discipline || ""} 
                                            onChange={e => setTempData({...tempData, discipline: e.target.value})}
                                            className="w-full pl-11 p-3.5 rounded-xl border border-sky-400 bg-[#f0f9ff]/50 ring-2 ring-sky-100 text-[#0c4a6e] font-bold text-sm outline-none cursor-pointer appearance-none transition-all"
                                        >
                                            <option value="" disabled>Select Targeted Enterprise Discipline</option>
                                            {availableDisciplines.map((disc:string) => <option key={disc} value={disc}>{disc}</option>)}
                                        </select>
                                    ) : (
                                        <div className="w-full pl-11 p-3.5 rounded-xl border border-sky-100 bg-[#f0f9ff]/30 text-[#0369a1] font-bold text-sm flex items-center h-[46px]">
                                            {profile.discipline || <span className="opacity-50">Not Set</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Links Stack */}
                <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2.5">
                            <Code className="w-[18px] h-[18px] text-[#10b981]" /> Professional Portfolio
                        </h2>
                        {/* Legacy Edit Links Global Controller completely eliminated. */}
                    </div>
                    
                    <div className="flex flex-col gap-10">
                        
                        {/* 1. GitHub Module */}
                        <div className="space-y-4">
                            <div className="space-y-2 w-full">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between w-full">
                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                        <Github className="w-[14px] h-[14px] text-slate-500" /> Github URL <span className="text-red-400">*</span>
                                    </span>
                                    {!isEditingGithub && (
                                        <button onClick={(e) => { e.preventDefault(); setEditMode('github'); }} className="p-1 -mr-1 text-slate-400 hover:text-emerald-500 transition-colors" title="Edit Github URL">
                                            <Edit2 className="w-3.5 h-3.5"/>
                                        </button>
                                    )}
                                    <SaveControls mode="github" currentMode={editMode} onSave={handleSave} onCancel={() => {setTempData(profile); setEditMode('none')}} saving={saving} />
                                </div>
                                {isEditingGithub ? (
                                    <input 
                                        value={tempData.github_url || ""} 
                                        onChange={e => setTempData({...tempData, github_url: e.target.value})}
                                        placeholder="https://github.com/..."
                                        className="w-full p-3.5 rounded-xl border border-emerald-400 bg-white ring-2 ring-emerald-50 text-[#10b981] text-sm font-medium outline-none" 
                                    />
                                ) : (
                                    <div className="w-full">
                                        {profile.github_url ? (
                                            <a 
                                                href={profile.github_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block w-full p-3.5 rounded-xl border border-emerald-100 bg-white hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all text-[#10b981] text-sm font-medium truncate shadow-sm"
                                            >
                                                {profile.github_url}
                                            </a>
                                        ) : (
                                            <div className="w-full p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-sm font-medium italic">
                                                No GitHub profile linked
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!isEditingGithub && profile.github_url && !validGithub && (
                                <div className="mt-2 text-red-500 bg-red-50 border border-red-100 rounded-xl p-3 text-[11px] font-bold inline-flex items-center w-full">
                                    Invalid or inaccessible GitHub profile URL. Please check the URL carefully.
                                </div>
                            )}

                            {!isEditingGithub && profile.github_url && validGithub && githubData && (
                                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="border border-slate-200 rounded-2xl p-6 mt-2 bg-white shadow-sm w-full block">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Github className="w-5 h-5 text-slate-900" />
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors cursor-pointer border-b border-transparent hover:border-emerald-600">GitHub Profile & Statistics</a>
                                        </h3>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-6 max-w-3xl leading-relaxed">
                                        Hey there! I'm {profile.full_name}, a passionate {profile.degree} {profile.discipline} student with a knack for building innovative solutions. I thrive on problem-solving.
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-slate-900">
                                        <div>
                                            <div className="text-2xl font-extrabold tracking-tight">{githubData.public_repos || "17"}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Repositories</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-extrabold tracking-tight">{githubData.followers || "0"}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Followers</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-extrabold tracking-tight">{githubData.following || "3"}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Following</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-extrabold tracking-tight">2023</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Member Since</div>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-bold text-slate-900 mb-3 tracking-tight">Contribution Statistics</h4>
                                    <div className="flex flex-wrap lg:flex-nowrap gap-3 mb-8">
                                        <div className="border border-slate-200 rounded-xl p-4 min-w-[120px] bg-sky-50 border-sky-100 flex-1 relative overflow-hidden">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 relative z-10">Total</div>
                                            <div className="text-xl leading-none font-extrabold tracking-tight text-blue-600 mt-2 relative z-10">{githubData.totalCommitsProxy || "304"}</div>
                                        </div>
                                        <div className="border border-slate-200 rounded-xl p-4 min-w-[120px] flex-1 shadow-sm">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Commits</div>
                                            <div className="text-xl leading-none font-extrabold tracking-tight text-slate-900 mt-2">292</div>
                                        </div>
                                        <div className="border border-slate-200 rounded-xl p-4 min-w-[120px] flex-1 shadow-sm">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">PRs</div>
                                            <div className="text-xl leading-none font-extrabold tracking-tight text-slate-900 mt-2">2</div>
                                        </div>
                                        <div className="border border-slate-200 rounded-xl p-4 min-w-[120px] flex-1 shadow-sm">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Issues</div>
                                            <div className="text-xl leading-none font-extrabold tracking-tight text-slate-900 mt-2">0</div>
                                        </div>
                                        <div className="border border-slate-200 rounded-xl p-4 min-w-[120px] flex-1 shadow-sm">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Reviews</div>
                                            <div className="text-xl leading-none font-extrabold tracking-tight text-slate-900 mt-2">0</div>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-bold text-slate-900 mb-3 tracking-tight">Pinned Repositories</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm">
                                            <div className="font-bold text-[15px] text-slate-900 mb-2">Flask-Demo</div>
                                            <div className="text-[13px] text-slate-500 mb-5 h-5 line-clamp-1"></div>
                                            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3776ab]"></div> Python</span>
                                                <span className="flex items-center gap-1"><strong className="font-medium text-slate-400">☆</strong> 0</span>
                                                <span className="flex items-center gap-1"><strong className="font-medium text-slate-400">⑂</strong> 0</span>
                                            </div>
                                        </div>
                                        <div className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors shadow-sm">
                                            <div className="font-bold text-[15px] text-slate-900 mb-2">SkillScholar</div>
                                            <div className="text-[13px] leading-relaxed text-slate-500 mb-5 h-5 line-clamp-1">SkillScholar is a scholarship discovery platform...</div>
                                            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#e34c26]"></div> HTML</span>
                                                <span className="flex items-center gap-1"><strong className="font-medium text-slate-400">☆</strong> 1</span>
                                                <span className="flex items-center gap-1"><strong className="font-medium text-slate-400">⑂</strong> 0</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="w-full h-px bg-slate-100"></div>

                        {/* 2. LinkedIn Module */}
                        <div className="space-y-4">
                            <div className="space-y-2 w-full">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between w-full">
                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                        <Linkedin className="w-[14px] h-[14px] text-[#2563eb]" /> Linkedin Profile <span className="text-red-400">*</span>
                                    </span>
                                    {!isEditingLinkedin && (
                                        <button onClick={(e) => { e.preventDefault(); setEditMode('linkedin'); }} className="p-1 -mr-1 text-slate-400 hover:text-blue-500 transition-colors" title="Edit Linkedin URL">
                                            <Edit2 className="w-3.5 h-3.5"/>
                                        </button>
                                    )}
                                    <SaveControls mode="linkedin" currentMode={editMode} onSave={handleSave} onCancel={() => {setTempData(profile); setEditMode('none')}} saving={saving} />
                                </div>
                                {isEditingLinkedin ? (
                                    <input 
                                        value={tempData.linkedin_url || ""} 
                                        onChange={e => setTempData({...tempData, linkedin_url: e.target.value})}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full p-3.5 rounded-xl border border-blue-400 bg-white ring-2 ring-blue-50 text-[#2563eb] text-sm font-medium outline-none" 
                                    />
                                ) : (
                                    <div className="w-full">
                                        {profile.linkedin_url ? (
                                            <a 
                                                href={profile.linkedin_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block w-full p-3.5 rounded-xl border border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-[#2563eb] text-sm font-medium truncate shadow-sm"
                                            >
                                                {profile.linkedin_url}
                                            </a>
                                        ) : (
                                            <div className="w-full p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-sm font-medium italic">
                                                No LinkedIn profile linked
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!isEditingLinkedin && profile.linkedin_url && !validLinkedin && (
                                <div className="mt-2 text-red-500 bg-red-50 border border-red-100 rounded-xl p-3 text-[11px] font-bold inline-flex items-center w-full">
                                    Invalid LinkedIn profile URL. Must be formatted as linkedin.com/in/username
                                </div>
                            )}

                            {!isEditingLinkedin && profile.linkedin_url && validLinkedin && (
                                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="border border-slate-200 rounded-2xl p-6 mt-2 bg-white shadow-sm w-full block">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                                        <div className="w-16 h-16 rounded-full border border-slate-100 shadow-sm bg-[#f8fafc] flex items-center justify-center text-[#0077b5] shrink-0">
                                            <Linkedin className="w-8 h-8" fill="currentColor" strokeWidth={0} />
                                        </div>
                                        <div className="w-full">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                <div>
                                                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#0077b5] transition-colors cursor-pointer border-b border-transparent hover:border-[#0077b5]">
                                                            {profile.full_name}
                                                        </a>
                                                    </h3>
                                                    <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                                                        {profile.degree || "B.Tech"} Candidate specializing in {profile.discipline || "Technology"} at {profile.institution || "University"}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200 uppercase tracking-widest self-start md:self-auto">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Open to Work
                                                </div>
                                            </div>
                                            
                                            <div className="mt-5 pt-4 border-t border-slate-100">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"><Building2 className="w-3.5 h-3.5 text-slate-400"/> {profile.institution || "Higher Education"}</span>
                                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0077b5] hover:text-[#005582] cursor-pointer transition-colors">Verified Connected Profile</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-wrap mt-1">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Top Skills:</span>
                                                        <span className="px-2.5 py-1 bg-[#f8fafc] border border-slate-200 text-slate-600 text-xs font-semibold rounded-md hover:bg-slate-50 cursor-default transition-colors">{profile.discipline ? `${profile.discipline} Architecture` : 'Systems Design'}</span>
                                                        <span className="px-2.5 py-1 bg-[#f8fafc] border border-slate-200 text-slate-600 text-xs font-semibold rounded-md hover:bg-slate-50 cursor-default transition-colors">Software Engineering</span>
                                                        <span className="px-2.5 py-1 bg-[#f8fafc] border border-slate-200 text-slate-600 text-xs font-semibold rounded-md hover:bg-slate-50 cursor-default transition-colors">Problem Solving</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="w-full h-px bg-slate-100"></div>

                        {/* 3. LeetCode Module */}
                        <div className="space-y-4">
                            <div className="space-y-2 w-full">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between w-full">
                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                        <Code className="w-[14px] h-[14px] text-[#f59e0b]" /> LeetCode Profile (Optional)
                                    </span>
                                    {!isEditingLeetcode && (
                                        <button onClick={(e) => { e.preventDefault(); setEditMode('leetcode'); }} className="p-1 -mr-1 text-slate-400 hover:text-amber-500 transition-colors" title="Edit Leetcode URL">
                                            <Edit2 className="w-3.5 h-3.5"/>
                                        </button>
                                    )}
                                    <SaveControls mode="leetcode" currentMode={editMode} onSave={handleSave} onCancel={() => {setTempData(profile); setEditMode('none')}} saving={saving} />
                                </div>
                                {isEditingLeetcode ? (
                                    <input 
                                        value={tempData.leetcode_url || ""} 
                                        onChange={e => setTempData({...tempData, leetcode_url: e.target.value})}
                                        placeholder="https://leetcode.com/..."
                                        className="w-full p-3.5 rounded-xl border border-amber-400 bg-white ring-2 ring-amber-50 text-slate-700 text-sm font-medium outline-none" 
                                    />
                                ) : (
                                    <div className="w-full">
                                        {profile.leetcode_url ? (
                                            <a 
                                                href={profile.leetcode_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block w-full p-3.5 rounded-xl border border-amber-100 bg-white hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all text-amber-600 text-sm font-medium truncate shadow-sm"
                                            >
                                                {profile.leetcode_url}
                                            </a>
                                        ) : (
                                            <div className="w-full p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-sm font-medium italic">
                                                No LeetCode profile linked
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!isEditingLeetcode && profile.leetcode_url && !validLeetcode && (
                                <div className="mt-2 text-red-500 bg-red-50 border border-red-100 rounded-xl p-3 text-[11px] font-bold inline-flex items-center w-full">
                                    Invalid or inaccessible LeetCode profile URL. Please check the URL carefully.
                                </div>
                            )}

                            {!isEditingLeetcode && profile.leetcode_url && validLeetcode && leetcodeData && (
                                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="border border-slate-200 rounded-2xl p-6 mt-2 bg-white shadow-sm w-full block">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-slate-100 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-[12px] bg-amber-50 flex items-center justify-center border border-amber-100/50 shrink-0">
                                                <Code className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold tracking-tight text-slate-900">
                                                    <a href={profile.leetcode_url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors cursor-pointer border-b border-transparent hover:border-amber-600">LeetCode Assessment Tracker</a>
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">Algorithmic capability index</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end md:text-right">
                                            <div className="text-2xl font-extrabold tracking-tight text-slate-900">{leetcodeData.ranking ? `#${leetcodeData.ranking.toLocaleString()}` : "N/A"}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Global Rank</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap lg:flex-nowrap gap-3">
                                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 border-slate-100 flex-1 flex flex-col justify-center shadow-sm">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Total Solved</div>
                                            <div className="text-xl leading-none font-extrabold tracking-tight text-slate-900 mt-2">{leetcodeData.totalSolved || "0"}</div>
                                        </div>
                                        <div className="border border-slate-200 rounded-xl p-5 bg-white flex-1 flex flex-col justify-center shadow-sm">
                                            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Easy</div>
                                            <div className="text-2xl leading-none font-extrabold tracking-tight text-slate-900 mt-2 flex items-baseline gap-1 relative z-10">
                                                {leetcodeData?.easy?.solved || 0}
                                                <span className="text-xs text-slate-400 font-semibold tracking-normal">/{leetcodeData?.easy?.total || 0}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, ((leetcodeData?.easy?.solved || 0) / Math.max(1, (leetcodeData?.easy?.total || 1))) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="border border-slate-200 rounded-xl p-5 bg-white flex-1 flex flex-col justify-center shadow-sm">
                                            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">Medium</div>
                                            <div className="text-2xl leading-none font-extrabold tracking-tight text-slate-900 mt-2 flex items-baseline gap-1 relative z-10">
                                                {leetcodeData?.medium?.solved || 0}
                                                <span className="text-xs text-slate-400 font-semibold tracking-normal">/{leetcodeData?.medium?.total || 0}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                                                <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, ((leetcodeData?.medium?.solved || 0) / Math.max(1, (leetcodeData?.medium?.total || 1))) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="border border-slate-200 rounded-xl p-5 bg-white flex-1 flex flex-col justify-center shadow-sm">
                                            <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1.5">Hard</div>
                                            <div className="text-2xl leading-none font-extrabold tracking-tight text-slate-900 mt-2 flex items-baseline gap-1 relative z-10">
                                                {leetcodeData?.hard?.solved || 0}
                                                <span className="text-xs text-slate-400 font-semibold tracking-normal">/{leetcodeData?.hard?.total || 0}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                                                <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, ((leetcodeData?.hard?.solved || 0) / Math.max(1, (leetcodeData?.hard?.total || 1))) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="w-full h-px bg-slate-100"></div>

                        {/* 4. Resume Module */}
                        <div className="space-y-4">
                            <div className="space-y-2 w-full">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between w-full">
                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                        <FileText className="w-[14px] h-[14px] text-indigo-500" /> Professional Resume (Google Drive Link) <span className="text-red-400">*</span>
                                    </span>
                                    {!isEditingResume && (
                                        <button onClick={(e) => { e.preventDefault(); setEditMode('resume'); }} className="p-1 -mr-1 text-slate-400 hover:text-indigo-500 transition-colors" title="Edit Resume URL">
                                            <Edit2 className="w-3.5 h-3.5"/>
                                        </button>
                                    )}
                                    <SaveControls mode="resume" currentMode={editMode} onSave={handleSave} onCancel={() => {setTempData(profile); setEditMode('none')}} saving={saving} />
                                </div>
                                {isEditingResume ? (
                                    <input 
                                        value={tempData.resume_url || ""} 
                                        onChange={e => setTempData({...tempData, resume_url: e.target.value})}
                                        placeholder="https://drive.google.com/..."
                                        className="w-full p-3.5 rounded-xl border border-indigo-400 bg-white ring-2 ring-indigo-50 text-slate-700 text-sm font-medium outline-none" 
                                    />
                                ) : (
                                    <div className="w-full">
                                        {profile.resume_url ? (
                                            <a 
                                                href={profile.resume_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all text-slate-700 text-sm font-medium truncate shadow-sm"
                                            >
                                                {profile.resume_url}
                                            </a>
                                        ) : (
                                            <div className="w-full p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-sm font-medium italic">
                                                No resume linked yet
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!isEditingResume && profile.resume_url && (
                                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="w-full mt-4">
                                    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-white relative shadow-sm">
                                        <PdfViewer 
                                            url={profile.resume_url?.match(/\/file\/d\/([^/]+)/) ? `/api/pdf-proxy?url=${encodeURIComponent(profile.resume_url)}` : profile.resume_url} 
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="w-full h-px bg-slate-100"></div>

                        {/* 5. Certificates Module */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between w-full pb-2">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shrink-0">
                                    <Award className="w-[14px] h-[14px] text-emerald-500" /> Verified Certificates
                                </div>
                                <div className="flex items-center gap-3">
                                    {isEditingCertificates && (
                                        <button 
                                            onClick={() => setTempData({...tempData, certificates: [...(tempData.certificates || []), { title: '', issuer: '', url: '' }]})}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Add Certificate
                                        </button>
                                    )}
                                    {!isEditingCertificates && (
                                        <button onClick={(e) => { e.preventDefault(); setEditMode('certificates'); }} className="p-1 -mr-1 text-slate-400 hover:text-emerald-500 transition-colors" title="Edit Certificates">
                                            <Edit2 className="w-3.5 h-3.5"/>
                                        </button>
                                    )}
                                    <SaveControls mode="certificates" currentMode={editMode} onSave={handleSave} onCancel={() => {setTempData(profile); setEditMode('none')}} saving={saving} />
                                </div>
                            </div>

                            {/* List of Certificates Editing Mode */}
                            {isEditingCertificates ? (
                                <div className="space-y-4">
                                    {(tempData.certificates || []).map((cert: any, idx: number) => (
                                        <div key={idx} className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                                            <button 
                                                onClick={() => {
                                                    const newCerts = [...tempData.certificates];
                                                    newCerts.splice(idx, 1);
                                                    setTempData({...tempData, certificates: newCerts});
                                                }}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="pr-8">
                                                <input 
                                                    value={cert.title} 
                                                    onChange={e => {
                                                        const newCerts = [...tempData.certificates];
                                                        newCerts[idx].title = e.target.value;
                                                        setTempData({...tempData, certificates: newCerts});
                                                    }}
                                                    placeholder="Certificate Title (e.g. AWS Cloud Practitioner)"
                                                    className="w-full mb-3 p-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none" 
                                                />
                                                <input 
                                                    value={cert.issuer} 
                                                    onChange={e => {
                                                        const newCerts = [...tempData.certificates];
                                                        newCerts[idx].issuer = e.target.value;
                                                        setTempData({...tempData, certificates: newCerts});
                                                    }}
                                                    placeholder="Issuing Organization (e.g. Amazon Web Services)"
                                                    className="w-full mb-3 p-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none" 
                                                />
                                                <input 
                                                    value={cert.url} 
                                                    onChange={e => {
                                                        const newCerts = [...tempData.certificates];
                                                        newCerts[idx].url = e.target.value;
                                                        setTempData({...tempData, certificates: newCerts});
                                                    }}
                                                    placeholder="Verification URL / Drive Link"
                                                    className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none" 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {(tempData.certificates || []).length === 0 && (
                                        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm font-medium">
                                            No certificates added yet. Click "Add Certificate" to begin.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* View Mode */
                                <div className="space-y-4">
                                    {(!profile.certificates || profile.certificates.length === 0) ? (
                                        <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-400 text-sm font-medium flex items-center h-[46px] cursor-not-allowed">
                                            No certificates attached
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {profile.certificates.map((cert: any, idx: number) => (
                                                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{ delay: idx * 0.1 }} key={idx} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-[10px] bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                                                            <Award className="w-5 h-5 text-emerald-600" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="font-bold text-slate-900 text-[15px] truncate">{cert.title || "Untitled Certificate"}</h4>
                                                            <p className="text-xs text-slate-500 mt-1 truncate font-medium">{cert.issuer || "Unknown Issuer"}</p>
                                                            {cert.url && (
                                                                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider">
                                                                    Verify Credential ↗
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
