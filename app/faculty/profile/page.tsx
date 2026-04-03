"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Building2, Phone, BrainCircuit, Edit2, Camera, Save, X, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { useAuth } from "@/context/auth-context"

import { COMPANIES } from "@/lib/companies"
import { getDisciplineIcon } from "@/lib/utils"

const DISCIPLINES = Array.from(new Set(COMPANIES.map(c => c.discipline))).sort()

const SaveControls = ({ mode, currentMode, onSave, onCancel, saving }: any) => {
    if (currentMode !== mode) return null;
    return (
        <div className="flex items-center gap-1.5 ml-2 -mr-1">
            <button 
                type="button"
                onClick={onCancel} 
                disabled={saving}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-md transition-colors"
                title="Cancel"
            >
                <X className="w-3.5 h-3.5" />
            </button>
            <button 
                type="button"
                onClick={onSave} 
                disabled={saving}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-200/60 rounded-md transition-colors font-bold text-[10px] uppercase tracking-wider relative overflow-hidden"
            >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check className="w-3.5 h-3.5" /> Save</>}
            </button>
        </div>
    )
}

export default function ProfilePage() {
    const [editMode, setEditMode] = useState<string>('none')
    const [saving, setSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user, updateUser } = useUser()
    const { user: authUser } = useAuth()
    const [tempData, setTempData] = useState(user)

    const isEditingPersonal = editMode === 'personal'
    const isEditingAcademic = editMode === 'academic'

    const handleSave = async () => {
        setSaving(true)
        await updateUser(tempData)
        setSaving(false)
        setEditMode('none')
        // Simulate a success toast or feedback here
    }

    const handlePhotoClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            alert(`Selected file: ${file.name} (Upload logic pending integration)`)
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6 pb-20 space-y-6">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* 1. Profile Feature Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6"
            >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="h-28 w-28 rounded-full ring-4 ring-slate-50 bg-white shadow-sm overflow-hidden flex items-center justify-center text-2xl font-bold text-indigo-900 bg-gradient-to-br from-indigo-50 to-violet-50">
                            {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <button
                            onClick={handlePhotoClick}
                            className="absolute bottom-1 right-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 cursor-pointer"
                        >
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Identity Block */}
                    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-slate-900">{user.fullName}</h1>
                        </div>
                        <p className="text-slate-500 font-medium text-base">
                            {user.designation || "Designation Not Set"} • {user.institution || "University Not Set"}
                        </p>
                        {user.discipline ? (
                            <p className="text-indigo-600 text-xs font-bold mt-3 bg-indigo-50 inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-indigo-100/50">
                                {(() => {
                                    const Icon = getDisciplineIcon(user.discipline)
                                    return <Icon className="w-3 h-3" />
                                })()}
                                {user.discipline}
                            </p>
                        ) : (
                            <p className="text-amber-600 text-xs font-bold mt-3 bg-amber-50 inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-amber-100/50">
                                Warning: Discipline Must Be Set
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col gap-6">
                {/* Left Column: Personal Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Section: Contact */}
                    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
                        <div className="text-base font-bold text-slate-900 mb-5 flex items-center justify-between w-full">
                            <span className="flex items-center gap-2">
                                <User className="w-4 h-4 text-indigo-500" />
                                Personal Information
                            </span>
                            {!isEditingPersonal && (
                                <button onClick={(e) => { e.preventDefault(); setEditMode('personal'); }} className="p-1 -m-1 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit Personal Information">
                                    <Edit2 className="w-[14px] h-[14px]"/>
                                </button>
                            )}
                            <SaveControls mode="personal" currentMode={editMode} onSave={handleSave} onCancel={() => {setTempData(user); setEditMode('none')}} saving={saving} />
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Full Name <span className="text-red-400">*</span></label>
                                <div className={`p-2.5 rounded-xl border ${isEditingPersonal ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-700 font-medium text-sm transition-all`}>
                                    {isEditingPersonal ? (
                                        <input
                                            value={tempData.fullName}
                                            onChange={(e) => setTempData({ ...tempData, fullName: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    ) : user.fullName}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Official Email <span className="text-red-400">*</span></label>
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium text-sm flex items-center justify-between cursor-not-allowed opacity-80" title="Managed by IT Admin">
                                    {user.email}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Phone Extension <span className="text-red-400">*</span></label>
                                <div className={`p-2.5 rounded-xl border ${isEditingPersonal ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-900 font-medium text-sm transition-all flex items-center gap-3`}>
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    {isEditingPersonal ? (
                                        <input
                                            value={tempData.phone}
                                            onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    ) : user.phone}
                                </div>
                            </div>
                        </div>
                    </section>
                </motion.div>

                {/* Right Column: Professional */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
                        <div className="text-base font-bold text-slate-900 mb-5 flex items-center justify-between w-full">
                            <span className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-indigo-500" />
                                Academic Details
                            </span>
                            {!isEditingAcademic && (
                                <button onClick={(e) => { e.preventDefault(); setEditMode('academic'); }} className="p-1 -m-1 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit Academic Profile">
                                    <Edit2 className="w-[14px] h-[14px]"/>
                                </button>
                            )}
                            <SaveControls mode="academic" currentMode={editMode} onSave={handleSave} onCancel={() => {setTempData(user); setEditMode('none')}} saving={saving} />
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Institution <span className="text-red-400">*</span></label>
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium text-sm flex items-center justify-between cursor-not-allowed opacity-80" title="Auto-resolved from Email Domain">
                                    {user.institution || "University Not Set"}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Department <span className="text-red-400">*</span></label>
                                <div className={`p-2.5 rounded-xl border ${isEditingAcademic ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-700 font-medium text-sm transition-all`}>
                                    {isEditingAcademic ? (
                                        <input
                                            value={tempData.department || ''}
                                            onChange={(e) => setTempData({ ...tempData, department: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                            placeholder="e.g. School of Engineering"
                                        />
                                    ) : user.department || "Not Set"}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Designation <span className="text-red-400">*</span></label>
                                <div className={`p-2.5 rounded-xl border ${isEditingAcademic ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-700 font-medium text-sm transition-all`}>
                                    {isEditingAcademic ? (
                                        <input
                                            value={tempData.designation || ''}
                                            onChange={(e) => setTempData({ ...tempData, designation: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                            placeholder="e.g. Assistant Professor"
                                        />
                                    ) : user.designation || "Not Set"}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Discipline <span className="text-red-400">*</span></label>
                                <div className={`p-2.5 rounded-xl border ${isEditingAcademic ? 'bg-white border-indigo-200 ring-2 ring-indigo-50 text-slate-700' : 'bg-indigo-50 border-indigo-100 text-indigo-700'} font-bold text-sm transition-all flex items-center gap-3`}>
                                    {(() => {
                                        const Icon = getDisciplineIcon(isEditingAcademic ? tempData.discipline : user.discipline)
                                        return <Icon className={`w-3.5 h-3.5 ${isEditingAcademic ? 'text-slate-400' : 'text-indigo-500'}`} />
                                    })()}
                                    {isEditingAcademic ? (
                                        <select
                                            value={tempData.discipline || ''}
                                            onChange={(e) => setTempData({ ...tempData, discipline: e.target.value })}
                                            className="w-full bg-transparent outline-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select Discipline</option>
                                            {DISCIPLINES.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    ) : user.discipline || "Not Set"}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialization</label>
                                <div className={`p-2.5 rounded-xl border ${isEditingAcademic ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-900 font-medium text-sm transition-all`}>
                                    {isEditingAcademic ? (
                                        <input
                                            value={tempData.specialization}
                                            onChange={(e) => setTempData({ ...tempData, specialization: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    ) : user.specialization}
                                </div>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
