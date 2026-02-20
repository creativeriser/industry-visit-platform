"use client"

import { useRouter } from "next/navigation"
import { Modal } from "@/components/ui/modal"
import { GraduationCap, School, Sparkles } from "lucide-react"

interface ExplorationWizardProps {
    isOpen: boolean
    onClose: () => void
}

// unused type removed

export function ExplorationWizard({ isOpen, onClose }: ExplorationWizardProps) {
    const router = useRouter()

    const handleRoleSelect = (selectedRole: "student" | "faculty") => {
        onClose()
        setTimeout(() => {
            router.push(`/get-started?role=${selectedRole}`)
        }, 300)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-xl"
        >
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                    Who are you?
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                    Select your role to access the dashboard.
                </p>
            </div>

            <div className="min-h-[200px] relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleRoleSelect("student")}
                        className="group relative p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all text-left space-y-4 hover:shadow-lg hover:shadow-blue-900/5"
                    >
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-700">Student</h3>
                            <p className="text-xs text-slate-500 mt-1">Looking for industry visits & internships</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect("faculty")}
                        className="group relative p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all text-left space-y-4 hover:shadow-lg hover:shadow-indigo-900/5"
                    >
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 group-hover:scale-110 transition-all">
                            <School className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Faculty</h3>
                            <p className="text-xs text-slate-500 mt-1">Organizing visits for my students</p>
                        </div>
                    </button>
                </div>
            </div>
        </Modal>
    )
}
