"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2, Building2, UserCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export function PartnerForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [type, setType] = useState("")
    const [capacity, setCapacity] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement)?.value || ""

            const { error } = await supabase.from('organization_requests').insert({
                organization_name: getVal('company'),
                website_url: getVal('website'),
                industry_sector: type,
                expected_capacity: capacity,
                contact_name: getVal('name'),
                contact_title: getVal('title'),
                contact_email: getVal('email'),
                contact_phone: getVal('phone'),
                additional_notes: getVal('message')
            })

            if (error) {
                console.error("Supabase Error:", error)
                throw new Error(error.message)
            }
            
            setIsSuccess(true)
        } catch (error: any) {
            console.error(error)
            alert("There was an error submitting your request: " + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-sm border border-green-100 relative">
                    <div className="absolute inset-0 rounded-full animate-ping bg-green-100 opacity-50"></div>
                    <CheckCircle2 className="w-12 h-12 relative z-10" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Organization Submitted!</h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                    Thank you for submitting an organization profile to UniVisit. We will carefully review the details and add the organization to our system upon approval.
                </p>
                <div className="pt-8">
                    <Link href="/">
                        <Button variant="default" size="lg" className="min-w-[220px] h-12 bg-primary hover:bg-primary/90 text-white text-lg shadow-lg">
                            Return to Home
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in duration-700">
            {/* Company Content Section */}
            <div className="space-y-6 bg-slate-50/40 hover:bg-slate-50/80 transition-colors p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shadow-sm">
                        <Building2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-primary tracking-tight">Organization Details</h4>
                        <p className="text-sm text-slate-500">Provide information about your organization</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
                    <div className="space-y-3">
                        <Label htmlFor="company" className="text-sm font-medium text-slate-800 flex items-center gap-1">Organization Name <span className="text-red-500">*</span></Label>
                        <Input id="company" placeholder="e.g. Acme Corporation" className="w-full px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all h-12 text-base shadow-sm rounded-xl" required />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="website" className="text-sm font-medium text-slate-800 flex items-center gap-1">Website URL</Label>
                        <Input id="website" type="url" placeholder="https://acme.com" className="w-full px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all h-12 text-base shadow-sm rounded-xl" />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="type" className="text-sm font-medium text-slate-800 flex items-center gap-1">Industry / Sector <span className="text-red-500">*</span></Label>
                        <Select required value={type} onValueChange={setType}>
                            <SelectTrigger id="type" className="w-full px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all h-12 text-base shadow-sm rounded-xl">
                                <SelectValue placeholder="Select industry sector" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="it">Information Technology</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="finance">Finance & Consulting</SelectItem>
                                <SelectItem value="healthcare">Healthcare / Biotech</SelectItem>
                                <SelectItem value="aerospace">Aerospace & Defense</SelectItem>
                                <SelectItem value="ecommerce">E-Commerce / Retail</SelectItem>
                                <SelectItem value="government">Government / Public Sector</SelectItem>
                                <SelectItem value="startup">Startup / Incubator</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="capacity" className="text-sm font-medium text-slate-800 flex items-center gap-1">Expected Visit Capacity <span className="text-red-500">*</span></Label>
                        <Select required value={capacity} onValueChange={setCapacity}>
                            <SelectTrigger id="capacity" className="w-full px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all h-12 text-base shadow-sm rounded-xl">
                                <SelectValue placeholder="e.g. 20-50 students" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="small">Small (10 - 20 students)</SelectItem>
                                <SelectItem value="medium">Medium (20 - 50 students)</SelectItem>
                                <SelectItem value="large">Large (50+ students)</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-6 bg-slate-50/40 hover:bg-slate-50/80 transition-colors p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shadow-sm">
                        <UserCircle2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-primary tracking-tight">Your Details</h4>
                        <p className="text-sm text-slate-500">Information of the person submitting</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-medium text-slate-800 flex items-center gap-1">Full Name <span className="text-red-500">*</span></Label>
                        <Input id="name" placeholder="John Doe" className="w-full px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all h-12 text-base shadow-sm rounded-xl" required />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-sm font-medium text-slate-800 flex items-center gap-1">Job Title / Role <span className="text-red-500">*</span></Label>
                        <Input id="title" placeholder="e.g. University Relations Manager" className="w-full px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all h-12 text-base shadow-sm rounded-xl" required />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-800 flex items-center gap-1">Official Email <span className="text-red-500">*</span></Label>
                        <Input id="email" type="email" placeholder="john@company.com" className="w-full px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all h-12 text-base shadow-sm rounded-xl" required />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="phone" className="text-sm font-medium text-slate-800 flex items-center gap-1">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all h-12 text-base shadow-sm rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-3 pt-2 px-2">
                <Label htmlFor="message" className="text-sm font-medium text-slate-800 flex items-center gap-1 mb-2 pl-1">Additional Notes (Optional)</Label>
                <Textarea
                    id="message"
                    placeholder="Provide any additional context or information about this organization..."
                    className="resize-none min-h-[160px] bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200 focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all text-base p-5 rounded-xl shadow-sm"
                />
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
                <p className="text-sm text-slate-500 max-w-sm text-center sm:text-left order-2 sm:order-1 leading-relaxed">
                    By submitting this organization, you agree to our <a href="#" className="font-medium text-slate-700 hover:text-blue-600 underline underline-offset-4 decoration-slate-300 transition-colors">Privacy Policy</a> and <a href="#" className="font-medium text-slate-700 hover:text-blue-600 underline underline-offset-4 decoration-slate-300 transition-colors">Terms of Service</a>.
                </p>
                <Button type="submit" size="lg" className="w-full sm:w-auto h-14 px-10 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all font-bold order-1 sm:order-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Submitting Request...
                        </>
                    ) : (
                        <span className="flex items-center">
                            Submit Organization
                            <ArrowRight className="w-5 h-5 ml-2.5" />
                        </span>
                    )}
                </Button>
            </div>
        </form>
    )
}
