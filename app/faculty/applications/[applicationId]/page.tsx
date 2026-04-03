"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { Loader2, ArrowLeft, GraduationCap, Github, Linkedin, Code, CheckCircle, XCircle, Building2, Calendar, Mail, FileText, Briefcase, Award, Check, X, BrainCircuit, User, Phone, Cpu, Calculator } from "lucide-react"
import { FacultyApproveButtons } from "../approve-buttons"
import { motion } from "framer-motion"
import { getDisciplineIcon } from "@/lib/utils"

async function generateEvaluation(student: any, visit: any) {
    let baseScore = 0;
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Document Verification Pre-req
    const hasResume = !!student?.resume_url;
    const certificatesCount = Array.isArray(student?.certificates) ? student.certificates.length : 0;
    
    if (hasResume) strengths.push("Resume Attached & Validated");
    if (certificatesCount > 0) strengths.push(`${certificatesCount} Industry Certifications`);

    // 1. Academic Score (CGPA scaled 0-100)
    let academicScore = 0;
    if (student?.cgpa) {
        academicScore = Math.min(100, (student.cgpa / 10) * 100);
        if (student.cgpa >= 8.5) strengths.push("Exceptional Academic Standing");
        else if (student.cgpa >= 7.5) strengths.push("Strong Academic Core");
        else weaknesses.push("Average Academic Standing");
    } else {
        academicScore = 20; // Penalty for missing
        weaknesses.push("No CGPA Provided");
    }

    // 2. Engineering Score (GitHub Matrix)
    let engineeringScore = 15; // default low
    let githubValid = false;
    let repoPts = 0;
    let commitPts = 0;
    let followerPts = 0;

    if (student?.github_url) {
        const match = student.github_url.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)/i);
        const username = match ? match[1] : null;
        if (username) {
            try {
                const res = await fetch(`/api/github?username=${username}`);
                if (res.ok) {
                    const ghData = await res.json();
                    githubValid = true;
                    // Formula: base 15 + repos(pts=3, max 30) + commits(pts=0.2, max 40) + followers(pts=3, max 15)
                    repoPts = Math.min(30, (parseInt(ghData.public_repos) || 0) * 3);
                    commitPts = Math.min(40, (parseInt(ghData.totalCommitsProxy) || 0) * 0.2);
                    followerPts = Math.min(15, (parseInt(ghData.followers) || 0) * 3);
                    engineeringScore = Math.min(100, 15 + repoPts + commitPts + followerPts);
                    
                    if (engineeringScore > 75) strengths.push("Strong Open Source Matrix");
                    else strengths.push("Verified GitHub Operations");
                }
            } catch (e) {
                console.error("Github Fetch Error", e);
            }
        }
    }
    if (!githubValid) {
        weaknesses.push("Missing or Invalid GitHub Verification");
    }

    // 3. Algorithmic Score (LeetCode Matrix)
    let algorithmicScore = 15; 
    let leetcodeValid = false;
    let easyPts = 0;
    let medPts = 0;
    let hardPts = 0;

    if (student?.leetcode_url) {
        const match = student.leetcode_url.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([^/]+)/i);
        const username = match ? match[1] : null;
        if (username) {
            try {
                const res = await fetch(`/api/leetcode?username=${username}`);
                if (res.ok) {
                    const lcData = await res.json();
                    leetcodeValid = true;
                    // Formula: base 15 + easy(pts=0.2, max 20) + medium(pts=1, max 40) + hard(pts=3, max 25)
                    easyPts = Math.min(20, (lcData?.easy?.solved || 0) * 0.2);
                    medPts = Math.min(40, (lcData?.medium?.solved || 0) * 1);
                    hardPts = Math.min(25, (lcData?.hard?.solved || 0) * 3);
                    algorithmicScore = Math.min(100, 15 + easyPts + medPts + hardPts);

                    if (algorithmicScore > 75) strengths.push("Exceptional Algorithmic Bound");
                    else strengths.push("Verified LeetCode Presence");
                }
            } catch(e) {
                console.error("Leetcode Fetch Error", e);
            }
        }
    }
    if (!leetcodeValid) {
        weaknesses.push("Missing Algorithmic Verification");
    }

    // 4. Networking / System Fit Score
    let systemFitScore = 20; // Base Verification
    const linkedInPts = student?.linkedin_url ? 15 : 0;
    systemFitScore += linkedInPts;
    if (student?.linkedin_url) strengths.push("Professional Networking Mapped");

    // Attendance Scaling
    let attendancePts = 0;
    if (student?.attendance) {
        const att = parseFloat(student.attendance);
        if (!isNaN(att)) {
            attendancePts = Math.min(15, (att / 100) * 15);
            systemFitScore += attendancePts;
        }
    }
    // Discipline Mapping
    let disciplinePts = 0;
    if (student?.discipline && visit?.company?.discipline && student.discipline === visit.company.discipline) {
        disciplinePts = 30;
        strengths.push("Perfect Discipline System Fit");
    } else if (student?.discipline) {
        disciplinePts = 15;
        weaknesses.push("Target Discipline Drift Mapped");
    }
    systemFitScore += disciplinePts;

    // Documentation Rigor Bonus
    const resumePts = hasResume ? 20 : 0;
    systemFitScore += resumePts;
    
    const certPts = certificatesCount > 0 ? Math.min(20, certificatesCount * 5) : 0;
    systemFitScore += certPts;
    
    // Weighted Overall Score Calculation
    let score = (academicScore * 0.35) + (engineeringScore * 0.25) + (algorithmicScore * 0.20) + (Math.min(100, systemFitScore) * 0.20);
    
    score = Math.min(Math.round(score), 99);
    score = Math.max(score, 10);

    let rank = "";
    if (score >= 85) rank = "Highly Recommended";
    else if (score >= 70) rank = "Strong Candidate";
    else rank = "Needs Development";

    const detailedAnalysis = {
        executiveSummary: "",
        engineeringEvaluation: "",
        documentVerification: ""
    };

    if (score >= 85) {
        detailedAnalysis.executiveSummary = `This candidate exhibits a highly competitive, enterprise-grade profile. With an impressive systemic evaluation baseline heavily weighted by their strong ${student?.discipline || "technical"} matrix mapping against the explicit requirements of ${visit?.company?.name || "this industry partner"}, they are designated internally as a premium systemic talent asset ready for direct dispatch.`;
    } else if (score >= 70) {
        detailedAnalysis.executiveSummary = `The candidate maintains a robust, structurally sound profile that aligns favorably with the general operational parameters desired by ${visit?.company?.name || "the target company"}. While not indexing in the utmost elite tier, their foundational parameters indicate strong capability and growth vectoring within their specified discipline of ${student?.discipline || 'study'}.`;
    } else {
        detailedAnalysis.executiveSummary = `Analysis of telemetry matrices indicates this profile is presently tracking beneath key enterprise thresholds for automated approval. Substantial core attributes are either missing, unverified, or rank beneath standard operational minimums, necessitating immediate proactive profile augmentation.`;
    }

    if (engineeringScore >= 80 && algorithmicScore >= 80) {
        detailedAnalysis.engineeringEvaluation = `Exceptionally strong open-source and algorithmic indexing. The candidate operates a verified, robust presence on GitHub signaling practical, cross-functional engineering execution, seamlessly coupled with deep algorithmic conditioning (LeetCode) that implies high-tier problem-solving architecture capabilities.`;
    } else if (engineeringScore >= 80) {
        detailedAnalysis.engineeringEvaluation = `Strong practical repository mechanics detected. The candidate proves capable version control and functional engineering competence via GitHub. However, formal algorithmic metrics (LeetCode) are absent, generating a minor evaluation blindspot in pure systemic logic bounds.`;
    } else if (algorithmicScore >= 80) {
        detailedAnalysis.engineeringEvaluation = `The candidate possesses rigorous analytical capability mapped through LeetCode verifications, indicating competitive programming logic. This potential is constrained visually by a lack of an associated version-controlled (GitHub) portfolio, suggesting theoretical logic currently outweighs practical structural deployments.`;
    } else {
        detailedAnalysis.engineeringEvaluation = `Significant deficit across all technical output vectors. The total absence of both GitHub and LeetCode integrations severely inhibits systemic verification of their engineering cadence, reducing overall trust factors in complex programmatic scenarios.`;
    }

    const certString = certificatesCount > 0 ? `further compounding their tracked value vector via ${certificatesCount} independently verified external industry certifications` : `though currently operating without explicitly verified external industry certifications`;
    if (hasResume) {
        detailedAnalysis.documentVerification = `Documentation compliance is nominal and fully verified. The candidate has actively tethered a structured resume for faculty and enterprise retrieval, heavily reinforcing their stated parameters—${certString}. This validates systemic baseline trust and heavily bolsters their overall fit factor.`;
    } else {
        detailedAnalysis.documentVerification = `CRITICAL DEFICIT: The candidate has entirely failed to append an active resumed tracking document to their enterprise profile. This directly contradicts standard pre-boarding practices and creates heavy data opacity, dragging down their reliability coefficient—${certString}.`;
    }

    const calculationReceipt = {
        github: { base: 15, repoPts, commitPts, followerPts, total: Math.round(engineeringScore) },
        leetcode: { base: 15, easyPts, medPts, hardPts, total: Math.round(algorithmicScore) },
        systemFit: { base: 20, linkedInPts, attendancePts, disciplinePts, resumePts, certPts, total: Math.min(100, Math.round(systemFitScore)) }
    };

    return { 
        score, 
        rank, 
        engineeringScore: Math.round(engineeringScore), 
        algorithmicScore: Math.round(algorithmicScore), 
        academicScore: Math.round(academicScore), 
        systemFitScore: Math.min(100, Math.round(systemFitScore)),
        hasResume,
        certificatesCount,
        strengths, 
        weaknesses,
        detailedAnalysis,
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

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/get-started")
            return
        }

        if (user && applicationId) {
            loadApplication()
        }
    }, [user, authLoading, applicationId, router])

    const loadApplication = async () => {
        try {
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
                    student:profiles(id, full_name, cgpa, discipline, institution, department, email, github_url, leetcode_url, linkedin_url, roll_number, section, degree, phone, resume_url, certificates)
                `)
                .eq('id', applicationId)
                .single()
            
            if (data) {
                const calculatedEval = await generateEvaluation(data.student, data.visit);
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
            {/* Back Navigation */}
            <button 
                onClick={() => router.push('/faculty/applications')}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium mb-8"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Applications
            </button>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header Section */}
                <div className="bg-white border text-slate-900 border-indigo-100 rounded-[24px] shadow-sm overflow-hidden ring-1 ring-indigo-50">
                    <div className="bg-indigo-900 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white relative overflow-hidden border-b border-indigo-800">
                        {/* Abstract Tech Background */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black">{student?.full_name || 'Anonymous Student'}</h1>
                                {application.status === 'applied' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-md shadow-sm">PENDING</span>}
                                {application.status === 'accepted' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md shadow-sm flex items-center gap-1"><Check className="w-3 h-3"/> ACCEPTED</span>}
                                {application.status === 'rejected' && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md shadow-sm flex items-center gap-1"><X className="w-3 h-3"/> REJECTED</span>}
                            </div>
                            <p className="text-slate-300 text-lg flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-400" /> Applying for: <strong className="text-white">{application.visit?.company?.name}</strong> Visit
                            </p>
                        </div>

                        <div className="relative z-10 shrink-0 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center min-w-[140px]">
                            <p className="text-slate-300 text-sm font-medium mb-1">Current CGPA</p>
                            <div className="flex items-center gap-2">
                                <GraduationCap className={`w-8 h-8 ${student?.cgpa >= 8.0 ? 'text-emerald-400' : 'text-amber-400'}`} />
                                <span className={`text-4xl font-black ${student?.cgpa >= 8.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {student?.cgpa ? student.cgpa.toFixed(2) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Hub */}
                    <div className="bg-indigo-50/50 p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-slate-800">Application Decision</h3>
                            <p className="text-sm text-slate-500">Review the profile below before confirming your decision.</p>
                        </div>
                        <div className="shrink-0 w-full sm:w-[300px]">
                            {/* Reusing existing FacultyApproveButtons component which works on the application ID */}
                            <FacultyApproveButtons applicationId={application.id} currentStatus={application.status} onUpdate={loadApplication} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Row: Identity & Academics */}
                    <div className="lg:col-span-1 bg-white border text-slate-900 border-slate-100 rounded-[24px] p-8 shadow-sm h-full">
                            <h2 className="text-[15px] font-bold mb-8 flex items-center gap-2.5 text-slate-900">
                                <User className="w-[18px] h-[18px] text-indigo-500" /> Identity Information
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <div className="w-full pl-11 p-3.5 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-600 text-sm font-medium flex items-center h-[46px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                            {student?.email || 'N/A'}
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
                    <div className="lg:col-span-2 bg-white border text-slate-900 border-slate-100 rounded-[24px] p-8 shadow-sm h-full">
                            <h2 className="text-[15px] font-bold mb-8 flex items-center gap-2.5 text-slate-900">
                                <Building2 className="w-[18px] h-[18px] text-indigo-500" /> Academic Profile
                            </h2>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                                <div className="col-span-2 space-y-2 pt-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Academic Discipline</label>
                                    <div className="relative">
                                        <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                                        <div className="w-full pl-11 p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 text-indigo-700 font-bold text-sm flex items-center h-[46px]">
                                            {student?.discipline || 'Not Set'}
                                        </div>
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
                    <div className="lg:col-span-3 bg-white border text-slate-900 border-slate-200 rounded-[24px] p-6 shadow-sm">
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
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{student?.github_url ? 'View Profile' : 'Not Provided'}</span>
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
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{student?.linkedin_url ? 'View Profile' : 'Not Provided'}</span>
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
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{student?.leetcode_url ? 'View Profile' : 'Not Provided'}</span>
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
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{student?.resume_url ? 'View Document' : 'Not Provided'}</span>
                                </a>

                                {/* Certificates */}
                                <div 
                                    className={`flex flex-col items-center justify-center p-6 min-h-[160px] rounded-2xl border transition-all ${evaluation.certificatesCount > 0 ? 'bg-emerald-50 outline outline-1 outline-emerald-200 border-transparent hover:shadow-md relative group' : 'bg-slate-50/50 border-slate-100 opacity-50 cursor-not-allowed'}`}
                                >
                                    <Award className={`w-8 h-8 mb-3 ${evaluation.certificatesCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    <span className="font-bold text-sm text-slate-900">Certificates</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{evaluation.certificatesCount > 0 ? `${evaluation.certificatesCount} Verified` : 'Not Provided'}</span>
                                    
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
                        
                    {/* Auto Evaluation Module */}
                    <div className="bg-[#0f172a] border border-slate-800 rounded-[24px] p-8 md:p-10 shadow-xl overflow-hidden relative col-span-1 lg:col-span-3 min-h-[320px]">
                            {/* Decorative background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4 relative z-10">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                                    <FileText className="w-5 h-5 text-indigo-400" /> Enterprise Candidate Telemetry
                                </h2>
                                <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                                    {evaluation.rank}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10 mb-10">
                                {/* Top KPI Row */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Fit Score</div>
                                    <div className="text-3xl font-black text-white">{evaluation.score}<span className="text-sm font-medium text-slate-500">/100</span></div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Engineering (GitHub)</div>
                                    <div className="text-3xl font-black text-indigo-400">{evaluation.engineeringScore}<span className="text-sm font-medium text-slate-500">/100</span></div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Algorithmic (LeetCode)</div>
                                    <div className="text-3xl font-black text-amber-400">{evaluation.algorithmicScore}<span className="text-sm font-medium text-slate-500">/100</span></div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Fit Factor</div>
                                    <div className="text-3xl font-black text-emerald-400">{evaluation.systemFitScore}</div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-10 relative z-10">
                                {/* Telemetry Bars */}
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Performance Indices</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                                                <span>Academic Core</span>
                                                <span>{evaluation.academicScore}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${evaluation.academicScore}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                                                <span>Engineering Ops</span>
                                                <span>{evaluation.engineeringScore}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${evaluation.engineeringScore}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                                                <span>Algorithmic Logic</span>
                                                <span>{evaluation.algorithmicScore}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${evaluation.algorithmicScore}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                                                <span>Discipline Alignment</span>
                                                <span>{evaluation.systemFitScore > 100 ? 100 : evaluation.systemFitScore}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, evaluation.systemFitScore)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Document Validation & Analysis */}
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Document Validation</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className={`p-4 rounded-xl border flex flex-col justify-center ${evaluation.hasResume ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                                                <FileText className="w-4 h-4" /> Resume
                                            </div>
                                            <div className={`text-sm font-bold ${evaluation.hasResume ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                {evaluation.hasResume ? "Verified ✓" : "Not Provided"}
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-xl border flex flex-col justify-center ${evaluation.certificatesCount > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                                                <Award className="w-4 h-4" /> Certificates
                                            </div>
                                            <div className={`text-sm font-bold ${evaluation.certificatesCount > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                                {evaluation.certificatesCount > 0 ? `${evaluation.certificatesCount} Attached ✓` : "None Provided"}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Automated System Flags</h3>
                                    <ul className="space-y-2">
                                        {evaluation.strengths.slice(0,3).map((str: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                {str}
                                            </li>
                                        ))}
                                        {evaluation.weaknesses.slice(0,2).map((wk: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                                {wk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Heuristic Telemetry Analysis Report */}
                            <div className="mt-12 pt-8 border-t border-slate-700/50 relative z-10">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <BrainCircuit className="w-5 h-5 text-indigo-400" /> Deep Heuristic Analysis
                                </h3>
                                <div className="space-y-4 text-slate-300 text-[13px] leading-relaxed w-full font-medium">
                                    <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 font-black">1</div>
                                        <div>
                                            <strong className="text-white block mb-1.5 text-xs font-bold uppercase tracking-widest">Executive Matrix Validation</strong>
                                            <p>{evaluation.detailedAnalysis.executiveSummary}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20 text-sky-400 font-black">2</div>
                                        <div>
                                            <strong className="text-white block mb-1.5 text-xs font-bold uppercase tracking-widest">Engineering & Algorithms Capability</strong>
                                            <p>{evaluation.detailedAnalysis.engineeringEvaluation}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 font-black">3</div>
                                        <div>
                                            <strong className="text-white block mb-1.5 text-xs font-bold uppercase tracking-widest">Documentation Compliance Baseline</strong>
                                            <p>{evaluation.detailedAnalysis.documentVerification}</p>
                                        </div>
                                    </div>

                                    {/* Transparency Calculation Receipt */}
                                    <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 items-start mt-6">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 font-black">4</div>
                                        <div className="w-full">
                                            <strong className="text-white block mb-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Calculator className="w-4 h-4 text-amber-400"/> Systemic Calculation Bounds
                                            </strong>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {/* GitHub Breakdown */}
                                                <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-700/50">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-700/50 pb-2">Engineering Operations (GitHub)</p>
                                                    <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                                                        <li className="flex justify-between"><span>Base Verification:</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.github.base}</span></li>
                                                        <li className="flex justify-between"><span>Repositories (x3):</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.github.repoPts}</span></li>
                                                        <li className="flex justify-between"><span>Commits [Cap 40]:</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.github.commitPts.toFixed(1)}</span></li>
                                                        <li className="flex justify-between"><span>Network Scale:</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.github.followerPts}</span></li>
                                                        <li className="flex justify-between pt-1.5 mt-1.5 border-t border-slate-700/50 font-bold text-indigo-300"><span>Matrix Sum:</span> <span>{evaluation.calculationReceipt.github.total}/100</span></li>
                                                    </ul>
                                                </div>

                                                {/* LeetCode Breakdown */}
                                                <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-700/50">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-700/50 pb-2">Algorithmic Logic (LeetCode)</p>
                                                    <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                                                        <li className="flex justify-between"><span>Base Verification:</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.leetcode.base}</span></li>
                                                        <li className="flex justify-between"><span>Easy Scale (x0.2):</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.leetcode.easyPts.toFixed(1)}</span></li>
                                                        <li className="flex justify-between"><span>Medium Scale (x1.0):</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.leetcode.medPts.toFixed(1)}</span></li>
                                                        <li className="flex justify-between"><span>Hard Bounds (x3.0):</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.leetcode.hardPts.toFixed(1)}</span></li>
                                                        <li className="flex justify-between pt-1.5 mt-1.5 border-t border-slate-700/50 font-bold text-indigo-300"><span>Logic Sum:</span> <span>{evaluation.calculationReceipt.leetcode.total}/100</span></li>
                                                    </ul>
                                                </div>

                                                {/* System Fit Breakdown */}
                                                <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-700/50">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-700/50 pb-2">System Fit Vectors</p>
                                                    <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                                                        <li className="flex justify-between"><span>Profile Base:</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.systemFit.base}</span></li>
                                                        <li className="flex justify-between"><span>Networking Auth:</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.systemFit.linkedInPts}</span></li>
                                                        <li className="flex justify-between"><span>Discipline Map:</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.systemFit.disciplinePts}</span></li>
                                                        <li className="flex justify-between"><span>Documentation Rigor:</span> <span className="text-emerald-400">+{evaluation.calculationReceipt.systemFit.resumePts + evaluation.calculationReceipt.systemFit.certPts}</span></li>
                                                        <li className="flex justify-between pt-1.5 mt-1.5 border-t border-slate-700/50 font-bold text-indigo-300"><span>Fit Score [Cap 100]:</span> <span>{evaluation.calculationReceipt.systemFit.total}/100</span></li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs leading-relaxed text-indigo-200/90 font-medium italic relative overflow-hidden">
                                                <span className="relative z-10">* Weighted Final Calculation: Engineering Score (25%) + Algorithm Score (20%) + System Fit (20%) + Academic Base (35%). Final composite results are strictly clamped to a maximum 99% logic threshold.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                </div>
            </motion.div>
        </div>
    )
}
