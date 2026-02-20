"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Building2, Phone, BrainCircuit, Edit2, Camera, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { useAuth } from "@/context/auth-context"

import { COMPANIES } from "@/lib/companies"
import { getDisciplineIcon } from "@/lib/utils"

const DISCIPLINES = Array.from(new Set(COMPANIES.map(c => c.discipline))).sort()


export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user, updateUser } = useUser()
    const { user: authUser } = useAuth()
    const [tempData, setTempData] = useState(user)

    // Sync temp data when user enters edit mode
    const handleEditToggle = () => {
        if (!isEditing) {
            setTempData(user)
        }
        setIsEditing(!isEditing)
    }

    const handleSave = async () => {
        await updateUser(tempData)
        setIsEditing(false)
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
                            {isEditing ? (
                                <Input
                                    value={tempData.fullName}
                                    onChange={(e) => setTempData({ ...tempData, fullName: e.target.value })}
                                    className="text-xl font-bold h-10 w-full md:w-96 text-center md:text-left"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-slate-900">{user.fullName}</h1>
                            )}
                        </div>
                        <p className="text-slate-500 font-medium text-base">
                            {user.designation} • {user.school}
                        </p>
                        <p className="text-indigo-600 text-xs font-bold mt-3 bg-indigo-50 inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-indigo-100/50">
                            {(() => {
                                const Icon = getDisciplineIcon(isEditing ? tempData.discipline : user.discipline)
                                return <Icon className="w-3 h-3" />
                            })()}
                            {isEditing ? tempData.discipline : user.discipline}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    Save
                                </Button>
                            </>
                        ) : (
                            <button
                                onClick={handleEditToggle}
                                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 text-xs flex items-center gap-2"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit Details
                            </button>
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
                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-500" />
                            Personal Information
                        </h2>

                        <div className="flex flex-col gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <div className={`p-2.5 rounded-xl border ${isEditing ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-700 font-medium text-sm transition-all`}>
                                    {isEditing ? (
                                        <input
                                            value={tempData.fullName}
                                            onChange={(e) => setTempData({ ...tempData, fullName: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    ) : user.fullName}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Email</label>
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium text-sm flex items-center justify-between cursor-not-allowed opacity-80" title="Managed by IT Admin">
                                    {user.email}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Extension</label>
                                <div className={`p-2.5 rounded-xl border ${isEditing ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-900 font-medium text-sm transition-all flex items-center gap-3`}>
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    {isEditing ? (
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
                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-500" />
                            Academic Details
                        </h2>

                        <div className="flex flex-col gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">School</label>
                                <div className={`p-2.5 rounded-xl border ${isEditing ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-700 font-medium text-sm transition-all`}>
                                    {isEditing ? (
                                        <input
                                            value={tempData.school}
                                            onChange={(e) => setTempData({ ...tempData, school: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                            placeholder="e.g. School of Engineering"
                                        />
                                    ) : user.school}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                                <div className={`p-2.5 rounded-xl border ${isEditing ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-700 font-medium text-sm transition-all`}>
                                    {isEditing ? (
                                        <input
                                            value={tempData.department}
                                            onChange={(e) => setTempData({ ...tempData, department: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    ) : user.department}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation</label>
                                <div className={`p-2.5 rounded-xl border ${isEditing ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-700 font-medium text-sm transition-all`}>
                                    {isEditing ? (
                                        <input
                                            value={tempData.designation}
                                            onChange={(e) => setTempData({ ...tempData, designation: e.target.value })}
                                            className="w-full bg-transparent outline-none"
                                        />
                                    ) : user.designation}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discipline</label>
                                <div className={`p-2.5 rounded-xl border ${isEditing ? 'bg-white border-indigo-200 ring-2 ring-indigo-50 text-slate-700' : 'bg-indigo-50 border-indigo-100 text-indigo-700'} font-bold text-sm transition-all flex items-center gap-3`}>
                                    {(() => {
                                        const Icon = getDisciplineIcon(isEditing ? tempData.discipline : user.discipline)
                                        return <Icon className={`w-3.5 h-3.5 ${isEditing ? 'text-slate-400' : 'text-indigo-500'}`} />
                                    })()}
                                    {isEditing ? (
                                        <select
                                            value={tempData.discipline}
                                            onChange={(e) => setTempData({ ...tempData, discipline: e.target.value })}
                                            className="w-full bg-transparent outline-none cursor-pointer"
                                        >
                                            {DISCIPLINES.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    ) : user.discipline}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialization</label>
                                <div className={`p-2.5 rounded-xl border ${isEditing ? 'bg-white border-indigo-200 ring-2 ring-indigo-50' : 'bg-white border-slate-200'} text-slate-900 font-medium text-sm transition-all`}>
                                    {isEditing ? (
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
