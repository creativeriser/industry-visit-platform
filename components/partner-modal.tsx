"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2 } from "lucide-react"

interface PartnerModalProps {
    isOpen: boolean
    onClose: () => void
}

export function PartnerModal({ isOpen, onClose }: PartnerModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSuccess(true)

        // Reset after delay
        setTimeout(() => {
            setIsSuccess(false)
            onClose()
        }, 2000)
    }

    if (isSuccess) {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Request Sent!</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                        Thank you for your interest. Our partnership team will review your details and get back to you shortly.
                    </p>
                </div>
            </Modal>
        )
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Partner with UniVisit"
            description="Join our network of industry leaders and academic institutions."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="company">Organization Name</Label>
                        <Input id="company" placeholder="Acme Corp" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select required>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="corporate">Corporate Partner</SelectItem>
                                <SelectItem value="academic">Academic Institution</SelectItem>
                                <SelectItem value="non-profit">Non-Profit Organization</SelectItem>
                                <SelectItem value="government">Government Agency</SelectItem>
                                <SelectItem value="startup">Startup / Incubator</SelectItem>
                                <SelectItem value="training">Training Provider</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Contact Person</Label>
                        <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Business Email</Label>
                        <Input id="email" type="email" placeholder="john@company.com" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                        id="message"
                        placeholder="Tell us broadly about how you'd like to partner..."
                        className="resize-none min-h-[80px]"
                    />
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                Submit Partnership Request
                            </>
                        )}
                    </Button>
                </div>

                <p className="text-[10px] text-center text-slate-400">
                    By submitting, you agree to our privacy policy and terms of service.
                </p>
            </form>
        </Modal>
    )
}

// Temporary Label component if not already in UI folder (checking...)
// I didn't see label.tsx in the list list_dir output earlier, so I'll include a simple inline one or creating it to be safe. 
// Actually standard shadcn/ui usually has it. I'll mock it locally in this file if needed or assume I need to create it.
// Assuming it might be missing based on list_dir, I will create a simple internal one or create UI component separately.
// Let's rely on standard html label for now to avoid errors, or quickly scaffold it? 
// No, I'll use standard HTML <label> with className to be safe, but "Label" is imported. 
// Wait, I imported Label from "@/components/ui/label". It wasn't in list_dir. I'll create it now to be safe.
// Actually, I'll allow this write_to_file to fail if I was wrong, but I'll write label.tsx safely in the next step.
// To avoid runtime error, I will remove the import and use className text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
