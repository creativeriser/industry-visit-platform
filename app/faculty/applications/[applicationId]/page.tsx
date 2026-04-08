"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { Loader2, ArrowLeft, GraduationCap, Github, Linkedin, Code, CheckCircle, XCircle, Building2, Calendar, Mail, FileText, Briefcase, Award, Check, X, BrainCircuit, User, Phone, Cpu, Calculator, Clock, CalendarCheck, Printer, Download, BarChart, PieChart, LineChart } from "lucide-react"
import { FacultyApproveButtons } from "../approve-buttons"
import { motion } from "framer-motion"
import { getDisciplineIcon } from "@/lib/utils"

const fetchCache = new Map();
async function fetchWithCache(url: string) {
    if (fetchCache.has(url)) return fetchCache.get(url);
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    fetchCache.set(url, data);
    return data;
}

async function generateEvaluation(student: any, visit: any, spamFlags: any = {}) {
    // 1. Academic Core (15% Weight)
    let academicScore = 0;
    let cgpaPts = 0;
    let attPts = 0;
    if (student?.cgpa && !spamFlags.cgpa) {
        cgpaPts = Math.min(100, (student.cgpa / 10) * 100);
    }
    if (student?.attendance && !spamFlags.attendance) {
        const att = parseFloat(student.attendance);
        if (!isNaN(att)) {
            attPts = Math.min(100, att);
        }
    }
    // Blend exactly: 60% CGPA, 40% Attendance to form the 0-100 Academic Core
    academicScore = (cgpaPts * 0.6) + (attPts * 0.4);

    // 2. Engineering Operations GitHub (35% Weight)
    let engineeringScore = 0; 
    let repoPts = 0;
    let commitPts = 0;
    let langPts = 0;
    let githubValid = false;
    let githubAudit = { repos: 0, commits: 0, langCounts: {} as Record<string, number>, numLangs: 0 };

    if (student?.github_url) {
        const match = student.github_url.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)/i);
        const username = match ? match[1] : null;
        if (username) {
            try {
                const ghData = await fetchWithCache(`http://localhost:3000/api/github?username=${username}`);
                githubValid = true;
                
                const repos = parseInt(ghData.public_repos) || 0;
                const commits = parseInt(ghData.totalCommitsProxy) || 0;
                const langCounts = ghData.langCounts || {};
                const numLangs = Object.keys(langCounts).length;
                
                githubAudit = { repos, commits, langCounts, numLangs };

                repoPts = (spamFlags.github || spamFlags.githubRepos) ? 0 : Math.min(40, repos * 1.5); 
                commitPts = (spamFlags.github || spamFlags.githubCommits) ? 0 : Math.min(30, commits * 0.1); 
                langPts = (spamFlags.github || spamFlags.githubLangs) ? 0 : Math.min(30, numLangs * 5.0); 
                engineeringScore = Math.min(100, repoPts + commitPts + langPts);
            } catch (e) {
                console.error("Github Fetch Error", e);
            }
        }
    }

    // 3. Algorithmic Logic LeetCode (35% Weight)
    let algorithmicScore = 0; 
    let leetcodeValid = false;
    let easyPts = 0, medPts = 0, hardPts = 0;
    let lcAudit = {
        easyVal: 0, medVal: 0, hardVal: 0,
        easyGlobal: 800, medGlobal: 1600, hardGlobal: 700,
        totalSolved: 0
    };

    if (student?.leetcode_url) {
        const match = student.leetcode_url.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([^/]+)/i);
        const username = match ? match[1] : null;
        if (username) {
            try {
                const lcData = await fetchWithCache(`http://localhost:3000/api/leetcode?username=${username}`);
                leetcodeValid = true;
                
                const easy = lcData?.easy?.solved || 0;
                const med = lcData?.medium?.solved || 0;
                const hard = lcData?.hard?.solved || 0;
                
                lcAudit.easyGlobal = lcData?.easy?.total || 800;
                lcAudit.medGlobal = lcData?.medium?.total || 1600;
                lcAudit.hardGlobal = lcData?.hard?.total || 700;
                
                lcAudit.easyVal = easy;
                lcAudit.medVal = med;
                lcAudit.hardVal = hard;
                lcAudit.totalSolved = easy + med + hard;

                easyPts = (spamFlags.leetcode || spamFlags.leetcodeEasy) ? 0 : Math.min(20, easy * 0.15); 
                medPts = (spamFlags.leetcode || spamFlags.leetcodeMedium) ? 0 : Math.min(40, med * 0.8); 
                hardPts = (spamFlags.leetcode || spamFlags.leetcodeHard) ? 0 : Math.min(40, hard * 3.0); 
                algorithmicScore = Math.min(100, easyPts + medPts + hardPts);
            } catch(e) {
                console.error("Leetcode Fetch Error", e);
            }
        }
    }

    // 4. Documentation & Identity (15% Weight)
    let docScore = 0;
    const hasResume = !!student?.resume_url;
    const certificatesCount = Array.isArray(student?.certificates) ? student.certificates.length : 0;
    const certTitles = Array.isArray(student?.certificates) ? student.certificates.map((c:any) => c.title).filter(Boolean) : [];
    
    // Baseline required for safety
    let resumePts = 0;
    if (hasResume && !spamFlags.resume) resumePts = 40; // Resume provides 40 out of 100 possible doc points
    docScore += resumePts;
    
    // Certs provide 20 points each, up to 60.
    let certPts = 0;
    if (!spamFlags.certificates) certPts = Math.min(60, certificatesCount * 20);
    docScore += certPts;

    // Final Composite Score (Max 99)
    let finalScore = (academicScore * 0.15) + (engineeringScore * 0.35) + (algorithmicScore * 0.35) + (docScore * 0.15);
    finalScore = Math.max(finalScore, 0); // Allow it to go down to 0 if all spammed
    finalScore = Math.min(Math.round(finalScore), 99);

    // -----------------------------------------------------
    // SIMPLE TEXT GENERATORS (FOR DOSSIER MULTI-PAGES)
    // -----------------------------------------------------
    
    // Executive Macro Readout
    let autoSummary = `The candidate has achieved a verifiable composite score of ${finalScore}/100. `;
    
    if (academicScore >= 75) autoSummary += `They maintain a highly robust academic foundation with a ${student?.cgpa || '0.0'} CGPA and ${student?.attendance || '0'}% attendance. `;
    else if (academicScore >= 50) autoSummary += `Their academic record is currently acceptable (CGPA: ${student?.cgpa || '0.0'}). `;
    else autoSummary += `Their institutional academic metrics are critically low and require immediate improvement. `;

    if (engineeringScore >= 70) autoSummary += `Practically, they exhibit excellent open-source engineering skills, managing ${githubAudit.repos} repositories across ${githubAudit.numLangs} distinct programming languages. `;
    else if (engineeringScore > 10) autoSummary += `They possess a moderate GitHub footprint, indicating basic familiarity with version control. `;
    else autoSummary += `Critically, they show near-zero activity on GitHub, which severely limits their practical verified experience. `;

    if (algorithmicScore >= 70) autoSummary += `Furthermore, they are highly capable problem solvers, successfully compiling logic for ${lcAudit.hardVal} Hard and ${lcAudit.medVal} Medium level algorithm challenges.`;
    else if (algorithmicScore > 10) autoSummary += `They show standard foundational logic capabilities, having solved ${lcAudit.totalSolved} total problems on LeetCode.`;
    else autoSummary += `They demonstrate a severe lack of competitive programming engagement, posing a risk for technical optimization tasks.`;

    // Huge GitHub Analysis Text
    let githubDossier = "";
    if (engineeringScore >= 80) githubDossier = `Great practical experience. The student has a total of ${githubAudit.repos} repositories and approximately ${githubAudit.commits} continuous commits, showing they regularly build and write code. They are very active on GitHub.`;
    else if (engineeringScore >= 40) githubDossier = `Moderate activity level. The student has created a few repositories but hasn't shown a massive amount of consistent, daily commits. Still acceptable for basic expectations.`;
    else githubDossier = `Very poor activity. The student has almost zero projects uploaded to their GitHub profile. This is a negative indicator for their practical coding experience.`;

    // Huge LeetCode Analysis Text
    let leetcodeDossier = "";
    if (algorithmicScore >= 80) leetcodeDossier = `Excellent problem solver. The candidate has heavily practiced algorithms, solving ${lcAudit.hardVal} Hard and ${lcAudit.medVal} Medium level questions on LeetCode.`;
    else if (algorithmicScore >= 40) leetcodeDossier = `Decent problem solver. The candidate has primarily demonstrated foundational logic by solving ${lcAudit.easyVal} Easy and ${lcAudit.medVal} Medium questions, but currently lacks advanced optimization skills.`;
    else leetcodeDossier = `Weak problem solving. The candidate has only solved a total of ${lcAudit.totalSolved} algorithmic problems across all tiers. They will likely struggle in technical coding rounds.`;

    const calculationReceipt = {
        academics: { cgpaPts: spamFlags.cgpa ? 0 : cgpaPts, attPts: spamFlags.attendance ? 0 : attPts, total: Math.round(academicScore) },
        github: { audit: githubAudit, repoPts: githubValid ? repoPts : 0, commitPts: githubValid ? commitPts : 0, langPts: githubValid ? langPts : 0, total: Math.round(engineeringScore) },
        leetcode: { audit: lcAudit, easyPts, medPts, hardPts, total: Math.round(algorithmicScore) },
        docs: { hasResume, certPts: spamFlags.certificates ? 0 : certPts, resumePts: spamFlags.resume ? 0 : resumePts, certTitles, total: Math.min(100, Math.round(docScore)) }
    };

    return { 
        score: finalScore, 
        engineeringScore: Math.round(engineeringScore), 
        algorithmicScore: Math.round(algorithmicScore), 
        academicScore: Math.round(academicScore), 
        docScore: Math.min(100, Math.round(docScore)),
        autoSummary,
        githubDossier,
        leetcodeDossier,
        calculationReceipt
    };
}

export default function StudentApplicationReportPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const params = useParams()
    const applicationId = params.applicationId as string

    const [application, setApplication] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [spamFlags, setSpamFlags] = useState({
        cgpa: false,
        attendance: false,
        resume: false,
        certificates: false,
        github: false,
        githubRepos: false,
        githubCommits: false,
        githubLangs: false,
        leetcode: false,
        leetcodeEasy: false,
        leetcodeMedium: false,
        leetcodeHard: false
    })

    const toggleSpam = async (key: keyof typeof spamFlags) => {
        const newFlags = { ...spamFlags, [key]: !spamFlags[key] };
        setSpamFlags(newFlags);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`spamFlags_${applicationId}`, JSON.stringify(newFlags));
        }
        if (application) {
            const calculatedEval = await generateEvaluation(application.student, application.visit, newFlags);
            setApplication((prev: any) => ({ ...prev, evaluation: calculatedEval }));
        }
    }

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/get-started")
            return
        }

        if (user && applicationId) {
            loadApplication()
        }
    }, [user, authLoading, applicationId, router]) // Intentionally not including spamFlags to only trigger on load

    const loadApplication = async () => {
        try {
            setLoading(true)
            let currentSpamFlags = spamFlags;
            if (typeof window !== 'undefined') {
                const savedSpamRaw = localStorage.getItem(`spamFlags_${applicationId}`);
                if (savedSpamRaw) {
                    try {
                        currentSpamFlags = JSON.parse(savedSpamRaw);
                        setSpamFlags(currentSpamFlags);
                    } catch(e) {
                        console.error("Failed to parse saved spam flags", e);
                    }
                }
            }

            const { data } = await supabase
                .from('visit_applications')
                .select(`
                    id,
                    status,
                    created_at,
                    visit:scheduled_visits(
                        proposed_date,
                        company:companies(name, location, type, image, discipline)
                    ),
                    student:profiles(id, full_name, cgpa, attendance, discipline, institution, department, email, github_url, leetcode_url, linkedin_url, roll_number, section, degree, phone, resume_url, certificates)
                `)
                .eq('id', applicationId)
                .single()
            
            if (data) {
                const calculatedEval = await generateEvaluation(data.student, data.visit, currentSpamFlags);
                setApplication({ ...data, evaluation: calculatedEval })
            } else {
                router.push('/faculty/applications')
            }
        } catch (err) {
            console.error(err)
            router.push('/faculty/applications')
        } finally {
            setLoading(false)
        }
    }

    if (loading || authLoading) return <div className="p-8 flex justify-center h-full items-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
    if (!application || !application.evaluation) return null

    const student = application.student
    const DisciplineIcon = getDisciplineIcon(student?.discipline)
    const evaluation = application.evaluation

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto h-full overflow-y-auto">
            {/* CSS Print Rules for PDF Output */}
            <style>{`
                @media print {
                    /* 1. Flatten all structural wrappers so Print Engine paginates correctly */
                    html, body, #__next, body > div, main, #faculty-content-wrapper, .space-y-8 {
                        display: block !important;
                        height: auto !important;
                        min-height: auto !important;
                        max-height: none !important;
                        overflow: visible !important;
                        position: static !important;
                    }

                    /* 2. Completely nuke the Mobile Topbar, Sidebar, and non-printable items */
                    aside, nav, header, .no-print, .md\:hidden {
                        display: none !important;
                    }
                    
                    /* 3. Strip structural padding from main wrappers so PDF occupies 100% width */
                    main, #faculty-content-wrapper {
                        padding: 0 !important;
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                    }

                    /* 4. Hide all Dashboard noise — ONLY keep the main Dossier ledger */
                    .space-y-8 > *:not(.grid) {
                        display: none !important;
                    }
                    .space-y-8 > .grid > *:not(#mega-report) {
                        display: none !important;
                    }
                    
                    /* 5. Anchor the Mega Report at the very top of the PDF cleanly */
                    #mega-report {
                        display: block !important;
                        position: static !important; 
                        width: 100% !important;
                        height: auto !important;
                        overflow: visible !important;
                        background-color: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        margin-top: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    
                    /* 6. Clean Page Break handling without forcing blank pages */
                    .dossier-page {
                        /* Force a break AFTER each major section ONLY if not handling overflow */
                        page-break-after: auto !important;
                        break-after: auto !important;
                        margin-bottom: 3rem !important;
                        border-bottom: 2px solid #0f172a !important; /* Explicit section dividers instead of whitespace */
                    }

                    /* 8. Prevent strict breaks inside critical atomic rows/cards to keep UI clean */
                    tr, tbody, thead, .grid > a, .bg-slate-50 {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .max-w-5xl {
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                }
            `}</style>
            
            {/* Back Navigation & Print Toolbar */}
            <div className="flex items-center justify-between font-medium mb-8 print:hidden">
                <button 
                    onClick={() => router.push('/faculty/applications')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Applications
                </button>
                <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-all shadow-sm active:scale-95 no-print"
                >
                    <Download className="w-4 h-4" /> Export Report to PDF
                </button>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header Section */}
                <div className="bg-white border text-slate-900 border-slate-200/80 rounded-[24px] shadow-sm overflow-hidden">
                    <div className="p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 border-b border-slate-100">
                        {/* Identity & Status */}
                        <div className="flex items-center gap-6">
                            {/* Monogram / Avatar Container */}
                            <div className="hidden sm:flex w-16 h-16 bg-slate-50 border border-slate-200/80 rounded-full items-center justify-center shrink-0">
                                <User className="w-7 h-7 text-slate-400" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-4 mb-2">
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{student?.full_name || 'Anonymous Student'}</h1>
                                </div>
                                <p className="text-slate-500 font-medium text-lg flex items-center gap-2 mt-1">
                                    <Briefcase className="w-5 h-5 text-slate-400" /> Applying for: <strong className="text-slate-900">{application.visit?.company?.name}</strong> Visit
                                </p>
                            </div>
                        </div>

                        {/* Enterprise Unified Metrics Block */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-8 px-8 py-5 bg-slate-50/50 border border-slate-200/60 rounded-[20px] shrink-0">
                            {/* CGPA */}
                            <div className="flex flex-col gap-1.5 min-w-[80px]">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <GraduationCap className="w-4 h-4 text-slate-400" /> CGPA
                                </span>
                                <span className={`text-2xl font-black tracking-tight ${student?.cgpa >= 8.0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {student?.cgpa ? student.cgpa.toFixed(2) : 'N/A'}
                                </span>
                            </div>
                            
                            {/* Divider */}
                            <div className="w-[1px] h-12 bg-slate-200/80 hidden sm:block"></div>
                            
                            {/* Attendance */}
                            <div className="flex flex-col gap-1.5 min-w-[80px]">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <CalendarCheck className="w-4 h-4 text-slate-400" /> Attendance
                                </span>
                                <span className={`text-2xl font-black tracking-tight ${student?.attendance >= 75 ? 'text-sky-600' : 'text-red-600'}`}>
                                    {student?.attendance ? `${student.attendance}%` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Hub */}
                    <div className="bg-slate-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-slate-800 text-lg">Application Decision</h3>
                                {application.status === 'applied' && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-md flex items-center gap-1.5 shadow-sm"><Clock className="w-3 h-3 text-amber-500" /> PENDING</span>}
                                {application.status === 'accepted' && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md flex items-center gap-1.5 shadow-sm"><Check className="w-3 h-3 text-emerald-500"/> ACCEPTED</span>}
                                {application.status === 'rejected' && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md flex items-center gap-1.5 shadow-sm"><X className="w-3 h-3 text-red-500"/> REJECTED</span>}
                            </div>
                            <p className="text-sm text-slate-500">Review the profile below before confirming your decision.</p>
                        </div>
                        <div className="shrink-0 w-full sm:w-[300px]">
                            {/* Reusing existing FacultyApproveButtons component which works on the application ID */}
                            <FacultyApproveButtons applicationId={application.id} currentStatus={application.status} onUpdate={loadApplication} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Top Row: Identity & Academics */}
                    <div className="lg:col-span-2 bg-white border text-slate-900 border-slate-100 rounded-[24px] p-8 shadow-sm h-full">
                            <h2 className="text-[15px] font-bold mb-8 flex items-center gap-2.5 text-slate-900">
                                <User className="w-[18px] h-[18px] text-indigo-500" /> Identity Information
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Student Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 shrink-0" />
                                        <div className="w-full pl-11 p-3.5 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-600 text-sm font-medium flex items-center h-[46px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                                            <span className="truncate w-full block">{student?.email || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Roll Number</label>
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium flex items-center h-[46px]">
                                        {student?.roll_number || 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <div className="w-full pl-11 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium flex items-center h-[46px]">
                                            {student?.phone || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Section</label>
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium flex items-center h-[46px]">
                                        {student?.section || 'N/A'}
                                    </div>
                                </div>
                            </div>
                    </div>

                    {/* Academics */}
                    <div className="lg:col-span-3 bg-white border text-slate-900 border-slate-100 rounded-[24px] p-8 shadow-sm h-full">
                            <h2 className="text-[15px] font-bold mb-8 flex items-center gap-2.5 text-slate-900">
                                <Building2 className="w-[18px] h-[18px] text-indigo-500" /> Academic Profile
                            </h2>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                                <div className="col-span-2 space-y-2 pt-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Academic Discipline</label>
                                    <div className="w-full flex items-center h-[46px]">
                                        <span className="inline-flex text-[11px] font-bold px-2.5 py-1 rounded-md items-center gap-1.5 text-sky-700 bg-sky-50 border border-sky-100/50 w-fit shadow-sm">
                                            <DisciplineIcon className="w-3.5 h-3.5 shrink-0" />
                                            {student?.discipline || 'Not Set'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Degree Program</label>
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium flex items-center h-[46px]">
                                        {student?.degree || 'N/A'}
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Institution</label>
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-700 text-sm font-bold flex items-center h-[46px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                        {student?.institution || "University Not Set"}
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Department</label>
                                    <div className="w-full p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-900 text-sm font-medium truncate flex items-center h-[46px]">
                                        {student?.department || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                    {/* Professional Links */}
                    <div className="lg:col-span-5 bg-white border text-slate-900 border-slate-200 rounded-[24px] p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-4">
                                <Code className="w-5 h-5 text-indigo-500" /> Professional Portfolio & Docs
                            </h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                                {/* GitHub */}
                                <a 
                                    href={student?.github_url || '#'} 
                                    target={student?.github_url ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={`flex flex-col items-center justify-center p-6 min-h-[160px] rounded-2xl border transition-all ${student?.github_url ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-50 cursor-not-allowed'}`}
                                >
                                    <Github className="w-8 h-8 mb-3 text-slate-700" />
                                    <span className="font-bold text-sm text-slate-900">GitHub</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{student?.github_url ? 'View URL' : 'None'}</span>
                                </a>

                                {/* LinkedIn */}
                                <a 
                                    href={student?.linkedin_url || '#'} 
                                    target={student?.linkedin_url ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={`flex flex-col items-center justify-center p-6 min-h-[160px] rounded-2xl border transition-all ${student?.linkedin_url ? 'bg-sky-50 outline outline-1 outline-sky-200 border-transparent hover:bg-sky-100 hover:shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-50 cursor-not-allowed'}`}
                                >
                                    <Linkedin className="w-8 h-8 mb-3 text-sky-600" />
                                    <span className="font-bold text-sm text-slate-900">LinkedIn</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{student?.linkedin_url ? 'View URL' : 'None'}</span>
                                </a>

                                {/* LeetCode */}
                                <a 
                                    href={student?.leetcode_url || '#'} 
                                    target={student?.leetcode_url ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={`flex flex-col items-center justify-center p-6 min-h-[160px] rounded-2xl border transition-all ${student?.leetcode_url ? 'bg-amber-50 outline outline-1 outline-amber-200 border-transparent hover:bg-amber-100 hover:shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-50 cursor-not-allowed'}`}
                                >
                                    <Code className="w-8 h-8 mb-3 text-amber-600" />
                                    <span className="font-bold text-sm text-slate-900">LeetCode</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{student?.leetcode_url ? 'View URL' : 'None'}</span>
                                </a>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Resume */}
                                <a 
                                    href={student?.resume_url || '#'} 
                                    target={student?.resume_url ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={`flex flex-col items-center justify-center p-6 min-h-[160px] rounded-2xl border transition-all ${student?.resume_url ? 'bg-indigo-50 outline outline-1 outline-indigo-200 border-transparent hover:bg-indigo-100 hover:shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-50 cursor-not-allowed'}`}
                                >
                                    <FileText className="w-8 h-8 mb-3 text-indigo-600" />
                                    <span className="font-bold text-sm text-slate-900">Resume</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{student?.resume_url ? 'View PDF' : 'None'}</span>
                                </a>

                                {/* Certificates */}
                                <div 
                                    className={`flex flex-col items-center justify-center p-6 min-h-[160px] rounded-2xl border transition-all ${evaluation.certificatesCount > 0 ? 'bg-emerald-50 outline outline-1 outline-emerald-200 border-transparent hover:shadow-md relative group' : 'bg-slate-50/50 border-slate-100 opacity-50 cursor-not-allowed'}`}
                                >
                                    <Award className={`w-8 h-8 mb-3 ${evaluation.certificatesCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    <span className="font-bold text-sm text-slate-900">Certificates</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{evaluation.certificatesCount > 0 ? 'View Records' : 'None'}</span>
                                    
                                    {evaluation.certificatesCount > 0 && (
                                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center p-3 shadow-inner">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">View Certs</p>
                                            <div className="flex flex-wrap justify-center gap-1.5 overflow-y-auto max-h-[100px] w-full styling-scrollbar">
                                                {student?.certificates?.map((cert: any, idx: number) => (
                                                    <a key={idx} href={cert.url || '#'} target={cert.url ? "_blank" : "_self"} rel="noopener noreferrer" className="px-2 py-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex-1 text-center truncate w-full hover:bg-emerald-200 transition-colors">
                                                        {cert.title || `Cert ${idx + 1}`}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                    {/* The NEW Mega Report: Bright, Formal, Print-Ready Vertical Dossier */}
                    <div id="mega-report" className="bg-white border text-slate-900 border-slate-200 rounded-[24px] p-10 shadow-sm overflow-hidden col-span-1 lg:col-span-5 relative mt-6">
                        {/* 
                            ======================================================
                            PAGE 0: REPORT HEADER & EXEC SUMMARY 
                            ======================================================
                        */}
                        <div className="mb-10 flex flex-col dossier-page border-b-2 border-slate-900 pb-8 pt-4">
                            <div className="flex flex-col mb-8 pb-6 border-b border-slate-100">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Student Report</h1>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Roll Number: {student?.roll_number}</p>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-slate-300" /> Executive Macro Summary
                                </h3>
                                <div className="p-6 bg-slate-50/80 text-sm rounded-xl border border-slate-200 text-slate-800 font-medium leading-relaxed shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                    {evaluation.autoSummary}
                                </div>
                            </div>
                        </div>

                        {/* Flex-Col vertical stacked layout forcing deep scrolling */}
                        <div className="flex flex-col space-y-12 mb-16">
                            
                            {/* 
                                ======================================================
                                PAGE 1: ACADEMIC & IDENTITY BASELINE
                                ======================================================
                            */}
                            <div className="flex flex-col justify-center dossier-page border-b border-dashed border-slate-200 pb-10">
                                <div className="mb-12">
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4 mb-4">
                                        <GraduationCap className="w-10 h-10 text-sky-500" /> Academic & Documentation Baseline
                                    </h2>
                                    <p className="text-slate-500 text-lg leading-relaxed max-w-3xl">
                                        This layer evaluates the candidate's core institutional output and verifiable industry baseline capabilities via physical certifications and tracked academic attendance strings.
                                    </p>
                                </div>

                                {/* Deep Analytical Data Table: Academics */}
                                <div className="w-full mb-8">
                                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3 bg-slate-50 p-2 rounded border border-slate-100">1. Academic Core Vector (15% Weight)</h3>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-900 border-b border-slate-700 text-slate-300 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-3">Tracked Metric</th>
                                                    <th className="p-3">Verified Value</th>
                                                    <th className="p-3">Scaling Algorithm</th>
                                                    <th className="p-3 text-right">Yielded Points</th>
                                                    <th className="p-3 text-right">Audit Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800 bg-slate-800 text-slate-200 font-mono">
                                                <tr>
                                                    <td className="p-3 text-slate-100">
                                                        Cumulative Grade Point (CGPA)
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`font-bold ${spamFlags.cgpa ? 'text-red-600 line-through' : 'text-sky-300'}`}>{student?.cgpa || '0.0'}</span>
                                                    </td>
                                                    <td className="p-3 text-amber-300">({student?.cgpa || '0.0'} × 10 Base) × 0.6 Weight</td>
                                                    <td className="p-3 text-right font-bold text-emerald-400">{(evaluation.calculationReceipt.academics.cgpaPts * 0.6).toFixed(1)}</td>
                                                    <td className="p-3 text-right">
                                                        <button onClick={() => toggleSpam('cgpa')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.cgpa ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'} print:hidden`}>
                                                            {spamFlags.cgpa ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.cgpa ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 text-slate-100">
                                                        Attendance Percentage
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`font-bold ${spamFlags.attendance ? 'text-red-600 line-through' : 'text-sky-300'}`}>{student?.attendance || '0'}%</span>
                                                    </td>
                                                    <td className="p-3 text-amber-300">{student?.attendance || '0'}% × 0.4 Weight</td>
                                                    <td className="p-3 text-right font-bold text-emerald-400">{(evaluation.calculationReceipt.academics.attPts * 0.4).toFixed(1)}</td>
                                                    <td className="p-3 text-right">
                                                        <button onClick={() => toggleSpam('attendance')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.attendance ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'} print:hidden`}>
                                                            {spamFlags.attendance ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.attendance ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot className="bg-sky-900 text-white font-bold text-lg">
                                                <tr>
                                                    <td colSpan={3} className="p-4 text-right uppercase tracking-widest text-sm">Academic Sub-Matrix Calculation Sum:</td>
                                                    <td className="p-4 text-right" colSpan={2}>{evaluation.calculationReceipt.academics.total} / 100</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500 italic pb-2">
                                        * System Note: Cumulative Grade Point (CGPA) is mathematically multiplied by a factor of 10 to normalize it to a 100-point scale before applying the 60% system weight. Physical attendance anchors the remaining 40% weight.
                                    </div>
                                </div>

                                {/* Deep Analytical Data Table: Documentation */}
                                <div className="w-full">
                                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3 bg-slate-50 p-2 rounded border border-slate-100">2. External Certification & Identity Stack (15% Weight)</h3>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-3">Document Category</th>
                                                    <th className="p-3">Tracked Assets</th>
                                                    <th className="p-3">Scaling Algorithm</th>
                                                    <th className="p-3 text-right">Yielded Points</th>
                                                    <th className="p-3 text-right">Audit Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-3 font-bold text-slate-800 align-top">
                                                        <FileText className="w-4 h-4 inline mr-2 text-indigo-400"/> Resume / CV Data
                                                    </td>
                                                    <td className="p-3 text-slate-500 align-top">
                                                        <span className={spamFlags.resume ? 'line-through text-red-600' : ''}>
                                                            {evaluation.calculationReceipt.docs.hasResume ? "1 Physical PDF Attached" : "Missing / Not Provided"}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-amber-600 font-mono text-sm align-top">{evaluation.calculationReceipt.docs.hasResume ? "Flat Rate Baseline Assignment" : "Verification Failed"}</td>
                                                    <td className="p-3 text-right font-mono font-bold text-emerald-600">{evaluation.calculationReceipt.docs.hasResume ? `+${evaluation.calculationReceipt.docs.resumePts.toFixed(1)} pts` : "0.0 pts"}</td>
                                                    <td className="p-3 text-right align-top">
                                                        <button onClick={() => toggleSpam('resume')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.resume ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'} print:hidden`}>
                                                            {spamFlags.resume ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.resume ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-slate-50">
                                                    <td className="p-3 font-bold text-slate-800 align-top mt-1">
                                                        <Award className="w-4 h-4 inline mr-2 text-indigo-400"/> Identity Certifications
                                                    </td>
                                                    <td className="p-3 align-top text-xs space-y-1">
                                                        <div className={spamFlags.certificates ? 'line-through text-red-600' : ''}>
                                                            {evaluation.calculationReceipt.docs.certTitles.length > 0 ? (
                                                                evaluation.calculationReceipt.docs.certTitles.map((title: string, i: number) => (
                                                                    <div key={i} className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 mt-0.5" /> <span className="font-mono">{title}</span></div>
                                                                ))
                                                            ) : (
                                                                <span className="italic text-slate-400">0 certificates recorded on file.</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-amber-600 font-mono text-sm align-top">{evaluation.calculationReceipt.docs.certTitles.length} Certs × 20.0 Points [Max 60]</td>
                                                    <td className="p-3 text-right font-mono font-bold text-emerald-600">+{evaluation.calculationReceipt.docs.certPts.toFixed(1)} pts</td>
                                                    <td className="p-3 text-right align-top">
                                                        <button onClick={() => toggleSpam('certificates')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.certificates ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'} print:hidden`}>
                                                            {spamFlags.certificates ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.certificates ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot className="bg-emerald-900 text-white font-bold text-lg">
                                                <tr>
                                                    <td colSpan={3} className="p-4 text-right uppercase tracking-widest text-sm">Documentation Calculation Sum:</td>
                                                    <td className="p-4 text-right" colSpan={2}>{evaluation.calculationReceipt.docs.total} / 100</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500 italic pb-2">
                                        * System Note: A verified Resume clears the basic security threshold (+40 pts). External certificates yield +20 pts each, capped structurally at 60 points (max 3 certificates considered) to neutralize exploit attempts.
                                    </div>
                                </div>
                            </div>

                            {/* 
                                ======================================================
                                PAGE 2: ENGINEERING OPERATIONS (GITHUB)
                                ======================================================
                            */}
                            <div className="flex flex-col justify-start dossier-page border-b border-dashed border-slate-200 pb-10 pt-6 relative">
                                <div className="mb-6 w-full">
                                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center justify-between gap-3 mb-2 border-b-2 border-slate-100 pb-3">
                                        <span className="flex items-center gap-3"><Github className="w-6 h-6 text-slate-600" /> GitHub Project Analysis (35%)</span>
                                        <button onClick={() => toggleSpam('github')} className={`w-[140px] text-center text-[10px] uppercase font-bold py-2 rounded-lg shadow-sm transition-colors ${spamFlags.github ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'} print:hidden`}>
                                            {spamFlags.github ? 'Unmark Matrix' : 'Flag as Spam'}
                                        </button>
                                        {spamFlags.github && <div className="hidden print:block text-xs uppercase font-black text-red-600 tracking-widest border-2 border-red-600 px-3 py-1 rounded-lg">MATRIX EXCLUDED</div>}
                                    </h2>
                                    {spamFlags.github && (
                                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold mb-2">
                                            ⚠️ This section is marked as SPAM. All metrics have been forcefully zeroed out for fairness.
                                        </div>
                                    )}
                                    <div className="p-4 bg-slate-50 text-sm text-slate-800 rounded-lg border border-slate-200 italic mt-4 font-medium shadow-sm leading-relaxed">
                                        Summary: {evaluation.githubDossier}
                                    </div>
                                </div>

                                {/* Detailed Language Taxonomy Table */}
                                <div className="mb-8 w-full">
                                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3 bg-slate-50 p-2 rounded border border-slate-100">1. Language Taxonomy Audit</h3>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-3">Detected Programming Language</th>
                                                    <th className="p-3">Repository Density (Count)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                                                {Object.keys(evaluation.calculationReceipt.github.audit.langCounts).length > 0 ? (
                                                    Object.entries(evaluation.calculationReceipt.github.audit.langCounts)
                                                        .sort(([,a], [,b]) => (b as number) - (a as number))
                                                        .map(([lang, count]) => (
                                                        <tr key={lang} className="hover:bg-slate-50 transition-colors">
                                                            <td className="p-3 font-bold flex items-center gap-2"><Code className="w-3 h-3 text-indigo-400"/> {lang}</td>
                                                            <td className="p-3 font-mono">{count} Repositories</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={2} className="p-4 text-center italic text-slate-400">Zero language taxonomy detected bounds.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-2 text-xs text-slate-400 italic">
                                        * System tracked {evaluation.calculationReceipt.github.audit.numLangs} distinctly verified languages originating from public repositories.
                                    </div>
                                </div>

                                {/* Raw Forensic Math Calculations */}
                                <div className="w-full">
                                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3 bg-slate-50 p-2 rounded border border-slate-100">2. Algorithmic Point Derivation</h3>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-900 border-b border-slate-700 text-slate-300 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-3">Metric Parameter</th>
                                                    <th className="p-3">Raw Value</th>
                                                    <th className="p-3">Formula Application</th>
                                                    <th className="p-3 text-right">Yielded Points</th>
                                                    <th className="p-3 text-right">Audit Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800 bg-slate-800 text-slate-200 font-mono">
                                                <tr className={spamFlags.github || spamFlags.githubRepos ? 'bg-slate-800/50' : ''}>
                                                    <td className="p-3">Total Repository Volume</td>
                                                    <td className={`p-3 ${(spamFlags.github || spamFlags.githubRepos) ? 'text-red-600 line-through' : 'text-sky-300'}`}>{evaluation.calculationReceipt.github.audit.repos}</td>
                                                    <td className="p-3 text-amber-300">{evaluation.calculationReceipt.github.audit.repos} Repos × 1.5 Multiplier [Max 40]</td>
                                                    <td className="p-3 text-right font-bold text-emerald-400">+{evaluation.calculationReceipt.github.repoPts.toFixed(1)}</td>
                                                    <td className="p-3 text-right">
                                                        <button disabled={spamFlags.github} onClick={() => toggleSpam('githubRepos')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.githubRepos ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'} disabled:opacity-50 disabled:cursor-not-allowed print:hidden`}>
                                                            {spamFlags.githubRepos ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.github || spamFlags.githubRepos ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className={spamFlags.github || spamFlags.githubCommits ? 'bg-slate-800/50' : ''}>
                                                    <td className="p-3">Proxy Commit Count</td>
                                                    <td className={`p-3 ${(spamFlags.github || spamFlags.githubCommits) ? 'text-red-600 line-through' : 'text-sky-300'}`}>{evaluation.calculationReceipt.github.audit.commits}</td>
                                                    <td className="p-3 text-amber-300">{evaluation.calculationReceipt.github.audit.commits} Commits × 0.1 Multiplier [Max 30]</td>
                                                    <td className="p-3 text-right font-bold text-emerald-400">+{evaluation.calculationReceipt.github.commitPts.toFixed(1)}</td>
                                                    <td className="p-3 text-right">
                                                        <button disabled={spamFlags.github} onClick={() => toggleSpam('githubCommits')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.githubCommits ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'} disabled:opacity-50 disabled:cursor-not-allowed print:hidden`}>
                                                            {spamFlags.githubCommits ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.github || spamFlags.githubCommits ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className={spamFlags.github || spamFlags.githubLangs ? 'bg-slate-800/50' : ''}>
                                                    <td className="p-3">Distinct Languages Used</td>
                                                    <td className={`p-3 ${(spamFlags.github || spamFlags.githubLangs) ? 'text-red-600 line-through' : 'text-sky-300'}`}>{evaluation.calculationReceipt.github.audit.numLangs}</td>
                                                    <td className="p-3 text-amber-300">{evaluation.calculationReceipt.github.audit.numLangs} Languages × 5.0 Bonus [Max 30]</td>
                                                    <td className="p-3 text-right font-bold text-emerald-400">+{evaluation.calculationReceipt.github.langPts.toFixed(1)}</td>
                                                    <td className="p-3 text-right">
                                                        <button disabled={spamFlags.github} onClick={() => toggleSpam('githubLangs')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.githubLangs ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'} disabled:opacity-50 disabled:cursor-not-allowed print:hidden`}>
                                                            {spamFlags.githubLangs ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.github || spamFlags.githubLangs ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot className="bg-indigo-900 text-white font-bold text-lg">
                                                <tr>
                                                    <td colSpan={3} className="p-4 text-right uppercase tracking-widest text-sm">Sub-Matrix Calculation Sum:</td>
                                                    <td className="p-4 text-right" colSpan={2}>{evaluation.calculationReceipt.github.total} / 100</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500 italic pb-2">
                                        * System Note: Proxy commits are forcibly capped at 30 points to combat automated scripting. Polyglot diversity (learning multiple distinct languages) receives a massive 5.0x multiplier to reward technical adaptability.
                                    </div>
                                </div>
                            </div>

                            {/* 
                                ======================================================
                                PAGE 3: ALGORITHMIC LOGIC (LEETCODE)
                                ======================================================
                            */}
                            <div className="flex flex-col justify-start dossier-page border-b border-dashed border-slate-200 pb-10 pt-6 relative">
                                <div className="mb-6 w-full">
                                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center justify-between gap-3 mb-2 border-b-2 border-slate-100 pb-3">
                                        <span className="flex items-center gap-3"><Calculator className="w-6 h-6 text-slate-600" /> LeetCode Problem Solving (35%)</span>
                                        <button onClick={() => toggleSpam('leetcode')} className={`w-[140px] text-center text-[10px] uppercase font-bold py-2 rounded-lg shadow-sm transition-colors ${spamFlags.leetcode ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'} print:hidden`}>
                                            {spamFlags.leetcode ? 'Unmark Matrix' : 'Flag as Spam'}
                                        </button>
                                        {spamFlags.leetcode && <div className="hidden print:block text-xs uppercase font-black text-red-600 tracking-widest border-2 border-red-600 px-3 py-1 rounded-lg">MATRIX EXCLUDED</div>}
                                    </h2>
                                    {spamFlags.leetcode && (
                                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold mb-2">
                                            ⚠️ This section is marked as SPAM. All metrics have been forcefully zeroed out for fairness.
                                        </div>
                                    )}
                                    <div className="p-4 bg-slate-50 text-sm text-slate-800 rounded-lg border border-slate-200 italic mt-4 font-medium shadow-sm leading-relaxed">
                                        Summary: {evaluation.leetcodeDossier}
                                    </div>
                                </div>

                                {/* Deep Analytical Data Table */}
                                <div className="w-full mb-8">
                                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3 bg-slate-50 p-2 rounded border border-slate-100">1. Global Pool Completion Rates</h3>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-3">Difficulty Tier</th>
                                                    <th className="p-3">Solved</th>
                                                    <th className="p-3">System Merit Target</th>
                                                    <th className="p-3 text-right">Target Completion</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-3 font-bold text-emerald-600">Easy Threshold</td>
                                                    <td className="p-3 font-mono">{evaluation.calculationReceipt.leetcode.audit.easyVal}</td>
                                                    <td className="p-3 font-mono text-slate-400">134 Expected</td>
                                                    <td className="p-3 text-right font-mono font-bold">{Math.min(100, (evaluation.calculationReceipt.leetcode.audit.easyVal / 134) * 100).toFixed(2)}%</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-3 font-bold text-amber-600">Medium Dynamics</td>
                                                    <td className="p-3 font-mono">{evaluation.calculationReceipt.leetcode.audit.medVal}</td>
                                                    <td className="p-3 font-mono text-slate-400">50 Expected</td>
                                                    <td className="p-3 text-right font-mono font-bold">{Math.min(100, (evaluation.calculationReceipt.leetcode.audit.medVal / 50) * 100).toFixed(2)}%</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-3 font-bold text-rose-600">Hard Optimization</td>
                                                    <td className="p-3 font-mono">{evaluation.calculationReceipt.leetcode.audit.hardVal}</td>
                                                    <td className="p-3 font-mono text-slate-400">14 Expected</td>
                                                    <td className="p-3 text-right font-mono font-bold">{Math.min(100, (evaluation.calculationReceipt.leetcode.audit.hardVal / 14) * 100).toFixed(2)}%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Raw Forensic Math Calculations */}
                                <div className="w-full">
                                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3 bg-slate-50 p-2 rounded border border-slate-100">2. Algorithmic Point Derivation</h3>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-900 border-b border-slate-700 text-slate-300 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-3">Difficulty Target</th>
                                                    <th className="p-3">Mathematical Formula</th>
                                                    <th className="p-3 text-right">Yielded Points</th>
                                                    <th className="p-3 text-right">Audit Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800 bg-slate-800 text-slate-200 font-mono">
                                                <tr className={spamFlags.leetcode || spamFlags.leetcodeEasy ? 'bg-slate-800/50' : ''}>
                                                    <td className={`p-3 ${(spamFlags.leetcode || spamFlags.leetcodeEasy) ? 'text-red-600 line-through' : ''}`}>Easy Level</td>
                                                    <td className="p-3 text-amber-300">{evaluation.calculationReceipt.leetcode.audit.easyVal} Solved × 0.15 Points [Max 20]</td>
                                                    <td className="p-3 text-right font-bold text-emerald-400">+{evaluation.calculationReceipt.leetcode.easyPts.toFixed(1)}</td>
                                                    <td className="p-3 text-right">
                                                        <button disabled={spamFlags.leetcode} onClick={() => toggleSpam('leetcodeEasy')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.leetcodeEasy ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'} disabled:opacity-50 disabled:cursor-not-allowed print:hidden`}>
                                                            {spamFlags.leetcodeEasy ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.leetcode || spamFlags.leetcodeEasy ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className={spamFlags.leetcode || spamFlags.leetcodeMedium ? 'bg-slate-800/50' : ''}>
                                                    <td className={`p-3 ${(spamFlags.leetcode || spamFlags.leetcodeMedium) ? 'text-red-600 line-through' : ''}`}>Medium Level</td>
                                                    <td className="p-3 text-amber-300">{evaluation.calculationReceipt.leetcode.audit.medVal} Solved × 0.8 Points [Max 40]</td>
                                                    <td className="p-3 text-right font-bold text-emerald-400">+{evaluation.calculationReceipt.leetcode.medPts.toFixed(1)}</td>
                                                    <td className="p-3 text-right">
                                                        <button disabled={spamFlags.leetcode} onClick={() => toggleSpam('leetcodeMedium')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.leetcodeMedium ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'} disabled:opacity-50 disabled:cursor-not-allowed print:hidden`}>
                                                            {spamFlags.leetcodeMedium ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.leetcode || spamFlags.leetcodeMedium ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className={spamFlags.leetcode || spamFlags.leetcodeHard ? 'bg-slate-800/50' : ''}>
                                                    <td className={`p-3 ${(spamFlags.leetcode || spamFlags.leetcodeHard) ? 'text-red-600 line-through' : ''}`}>Hard Level</td>
                                                    <td className="p-3 text-amber-300">{evaluation.calculationReceipt.leetcode.audit.hardVal} Solved × 3.0 Points [Max 40]</td>
                                                    <td className="p-3 text-right font-bold text-emerald-400">+{evaluation.calculationReceipt.leetcode.hardPts.toFixed(1)}</td>
                                                    <td className="p-3 text-right">
                                                        <button disabled={spamFlags.leetcode} onClick={() => toggleSpam('leetcodeHard')} className={`w-[95px] text-center text-[9px] uppercase tracking-wider font-bold py-1.5 rounded shadow-sm transition-colors ${spamFlags.leetcodeHard ? 'bg-red-600 text-white border border-red-700 hover:bg-red-700' : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'} disabled:opacity-50 disabled:cursor-not-allowed print:hidden`}>
                                                            {spamFlags.leetcodeHard ? 'Unmark Spam' : 'Flag Spam'}
                                                        </button>
                                                        <div className="hidden print:block text-[10px] uppercase font-black tracking-widest">
                                                            {spamFlags.leetcode || spamFlags.leetcodeHard ? <span className="text-red-600">REDACTED</span> : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot className="bg-amber-900 text-white font-bold text-lg">
                                                <tr>
                                                    <td colSpan={2} className="p-4 text-right uppercase tracking-widest text-sm">Sub-Matrix Calculation Sum:</td>
                                                    <td className="p-4 text-right" colSpan={2}>{evaluation.calculationReceipt.leetcode.total} / 100</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500 italic pb-2">
                                        * System Note: Easy bounds are deeply suppressed (x0.15) to avoid rewarding basic syntax repetition. Hard algorithmic capabilities are heavily incentivized (x3.0) to filter for elite optimization capacity.
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* 
                            ======================================================
                            PAGE 4: FINAL CONSOLIDATED METRIC READOUT
                            ======================================================
                        */}
                        <div className="pt-10 pb-8 flex flex-col justify-start dossier-page">
                            <div className="mb-10 w-full">
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4 mb-4">
                                    <PieChart className="w-10 h-10 text-indigo-600" /> Consolidated Scoring Matrix
                                </h2>
                                <p className="text-slate-500 text-lg leading-relaxed max-w-3xl">
                                    Aggregating the four weighted operational data pillars (Academic, Documentation, GitHub, LeetCode) to mathematically derive the candidate's final unified system metric.
                                </p>
                            </div>

                            <div className="border-[3px] border-slate-900 rounded-xl overflow-hidden shadow-2xl bg-white w-full">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-900 text-slate-300 font-bold uppercase tracking-widest text-sm">
                                        <tr>
                                            <th className="p-6">Evaluation Pillar</th>
                                            <th className="p-6">Raw Matrix Score</th>
                                            <th className="p-6">System Weight Applied</th>
                                            <th className="p-6 text-right">Calculated Sub-Yield</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-slate-800 font-mono text-lg">
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-6 font-bold uppercase">1. Academic Core Foundation</td>
                                            <td className="p-6 text-slate-500 font-mono">{evaluation.calculationReceipt.academics.total} / 100</td>
                                            <td className="p-6 text-amber-600 font-bold uppercase text-xs tracking-wider">15% Engine Distribution</td>
                                            <td className="p-6 text-right font-black text-indigo-600 flex items-center justify-end gap-3">
                                                <span className="text-slate-400 font-medium text-lg font-mono tracking-tighter">{evaluation.calculationReceipt.academics.total} × 0.15 =</span>
                                                <span className="w-[105px] inline-block">{(evaluation.calculationReceipt.academics.total * 0.15).toFixed(2)} pts</span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-6 font-bold uppercase">2. Documentation & Identity</td>
                                            <td className="p-6 text-slate-500 font-mono">{evaluation.calculationReceipt.docs.total} / 100</td>
                                            <td className="p-6 text-amber-600 font-bold uppercase text-xs tracking-wider">15% Engine Distribution</td>
                                            <td className="p-6 text-right font-black text-indigo-600 flex items-center justify-end gap-3">
                                                <span className="text-slate-400 font-medium text-lg font-mono tracking-tighter">{evaluation.calculationReceipt.docs.total} × 0.15 =</span>
                                                <span className="w-[105px] inline-block">{(evaluation.calculationReceipt.docs.total * 0.15).toFixed(2)} pts</span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-6 font-bold uppercase">3. GitHub Project Baseline</td>
                                            <td className="p-6 text-slate-500 font-mono">{evaluation.calculationReceipt.github.total} / 100</td>
                                            <td className="p-6 text-amber-600 font-bold uppercase text-xs tracking-wider">35% Engine Distribution</td>
                                            <td className="p-6 text-right font-black text-indigo-600 flex items-center justify-end gap-3">
                                                <span className="text-slate-400 font-medium text-lg font-mono tracking-tighter">{evaluation.calculationReceipt.github.total} × 0.35 =</span>
                                                <span className="w-[105px] inline-block">{(evaluation.calculationReceipt.github.total * 0.35).toFixed(2)} pts</span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="p-6 font-bold uppercase">4. LeetCode Analytic Bounds</td>
                                            <td className="p-6 text-slate-500 font-mono">{evaluation.calculationReceipt.leetcode.total} / 100</td>
                                            <td className="p-6 text-amber-600 font-bold uppercase text-xs tracking-wider">35% Engine Distribution</td>
                                            <td className="p-6 text-right font-black text-indigo-600 flex items-center justify-end gap-3">
                                                <span className="text-slate-400 font-medium text-lg font-mono tracking-tighter">{evaluation.calculationReceipt.leetcode.total} × 0.35 =</span>
                                                <span className="w-[105px] inline-block">{(evaluation.calculationReceipt.leetcode.total * 0.35).toFixed(2)} pts</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot className="bg-slate-100 border-t-[4px] border-slate-900">
                                        <tr>
                                            <td className="p-8 text-right font-black text-slate-900 text-2xl uppercase tracking-widest" colSpan={3}>
                                                Final Evaluated System Metric:
                                            </td>
                                            <td className="p-8 text-right text-5xl font-black text-emerald-600 tracking-tighter">
                                                {evaluation.score} <span className="text-xl text-slate-500 tracking-normal">/ 100</span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>
            </motion.div>
        </div>
    )
}
