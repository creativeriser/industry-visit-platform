
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getCompanyById } from "@/lib/companies"
import { ArrowLeft, MapPin, Calendar, Clock, GraduationCap, CheckCircle, Phone, Mail, User, Building2, CalendarClock, BrainCircuit } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getDisciplineIcon } from "@/lib/utils"

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const company = await getCompanyById(parseInt(id))

    if (!company) {
        notFound()
    }

    // Resolve dynamic icon
    const DisciplineIcon = getDisciplineIcon(company.discipline)

    return (
        <div className="w-full h-full overflow-y-auto bg-slate-50/30">

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-6 py-8">



                <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">

                    {/* Header Section (Matching Sketch: Title + Location | Tag Right) */}
                    <div className="p-8 md:p-10 border-b border-slate-100 relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{company.name}</h1>
                                    <div className="flex items-center text-slate-500 font-medium">
                                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                        {company.location}
                                    </div>
                                </div>

                            </div>

                            {/* Tag Name (Sketch: "Tag name / Stream") */}
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Curated Stream</span>
                                <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 border-indigo-100/50 px-3 py-1 text-xs rounded-md font-bold tracking-normal shadow-none inline-flex items-center gap-1.5">
                                    <DisciplineIcon className="w-3 h-3" />
                                    {company.discipline}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-8 md:p-10 grid md:grid-cols-3 gap-12">

                    {/* Left Column: Description & Details */}
                    <div className="md:col-span-2 space-y-10">

                        {/* Company Description */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                                About the Visit
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                    {company.type}
                                </span>
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {company.description}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {company.tags.map(tag => (
                                    <span key={tag} className="text-sm font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Industry Representative Section (Matching Sketch) */}
                        <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/60">
                            <h3 className="text-base font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Industry Representative</h3>

                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900">{company.representative.name}</h4>
                                        <p className="text-indigo-600 font-medium text-sm">{company.representative.role}</p>
                                    </div>
                                </div>

                                {/* Contact Details Buttons (Matching Sketch) */}
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button variant="outline" className="flex-1 sm:flex-none border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 gap-2" asChild>
                                        <a href={`tel:${company.representative.phone}`}>
                                            <Phone className="w-4 h-4" />
                                            Call
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="flex-1 sm:flex-none border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 gap-2" asChild>
                                        <a href={`mailto:${company.representative.email}`}>
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Schedule */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-lg bg-indigo-600 text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <CalendarClock className="w-32 h-32 transform translate-x-10 -translate-y-10" />
                            </div>
                            <CardContent className="p-6 relative z-10 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Ready to Plan?</h3>
                                    <p className="text-indigo-100 text-sm opacity-90">
                                        Coordinate with {company.representative.name} and finalize your visit schedule.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-indigo-100">
                                        <Calendar className="w-4 h-4 mr-3 opacity-70" />
                                        Target: {company.date}
                                    </div>
                                    <div className="flex items-center text-sm text-indigo-100">
                                        <User className="w-4 h-4 mr-3 opacity-70" />
                                        Capacity: {company.capacity} Students
                                    </div>
                                </div>

                                <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-bold h-12 rounded-xl shadow-lg border-0 mt-2" asChild>
                                    <a href={`mailto:${company.representative.email}?subject=Industry Visit Request: ${company.name}&body=Dear ${company.representative.name},%0D%0A%0D%0AI would like to schedule a visit for my students...`}>
                                        Schedule Visit
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4 text-sm">Prerequisites</h4>
                            <ul className="space-y-3">
                                {company.requirements.map((req, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-600">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
