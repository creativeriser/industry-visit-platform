"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Users, ShieldAlert, GraduationCap, Briefcase, Mail, Building, Check, Ban } from "lucide-react"

export default function UsersAccessManagement() {
    const [profiles, setProfiles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'active' | 'suspended'>('active')
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const fetchProfiles = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            
        if (!error && data) {
            setProfiles(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProfiles()
    }, [])



    const handleToggleSuspension = async (userId: string, isCurrentlySuspended: boolean) => {
        const newStatus = isCurrentlySuspended ? 'active' : 'suspended';
        const actionText = isCurrentlySuspended ? 'restore access' : 'suspend access';
        
        if (!confirm(`Are you sure you want to ${actionText} for this identity?`)) return;
        
        setUpdatingId(userId)
        
        const { data, error } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', userId)
            .select()

        if (error || !data || data.length === 0) {
            alert(`SECURITY BLOCK: The action failed silently because Admin RLS Policies are missing on the 'profiles' table. \n\nExecute this SQL in your Supabase SQL Editor to grant Admins the power to suspend accounts:\n\ncreate policy "Admins can update profiles" on profiles for update using (exists (select 1 from profiles as p where p.id = auth.uid() and p.role = 'admin'));`)
        } else {
            // Confirm database sync before hiding row
            setProfiles(prev => prev.map(p => p.id === userId ? { ...p, status: newStatus } : p))
        }
        
        setUpdatingId(null)
    }

    return (
        <div className="p-6 md:p-10 w-full h-full overflow-y-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-600" /> Identity Access Control
                    </h1>
                    <p className="text-slate-500 mt-2">Oversee registered accounts and manually verify or elevate permissions.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Active Identities
                    </button>
                    <button 
                        onClick={() => setActiveTab('suspended')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'suspended' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Suspended Accounts
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                </div>
            ) : profiles.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No Users Found</h3>
                    <p className="text-slate-500 mt-1">The system has no registered profiles.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden auto-cols-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 uppercase text-xs tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">User Alias / Email</th>
                                    <th className="px-6 py-4">Current Role</th>
                                    <th className="px-6 py-4">Institution Context</th>
                                    <th className="px-6 py-4 text-right">Access Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {profiles.filter(p => activeTab === 'active' ? p.status !== 'suspended' : p.status === 'suspended').map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 flex items-center gap-2">
                                                    {user.full_name || "Unregistered Identity"}
                                                    {user.status === 'suspended' && (
                                                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 text-[10px] ml-2">SUSPENDED</Badge>
                                                    )}
                                                </span>
                                                <span className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                                    <Mail className="w-3.5 h-3.5" /> {user.email || "No email on record"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className={`border-0 capitalize ${
                                                user.role === 'admin' ? 'bg-red-100 text-red-700' : 
                                                user.role === 'faculty' ? 'bg-indigo-100 text-indigo-700' : 
                                                'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {user.role || 'Unassigned'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                                                        <ShieldAlert className="w-4 h-4 text-red-500" /> Administrative Core
                                                    </span>
                                                    <span className="text-xs text-slate-500 mt-1">Platform Operations</span>
                                                </div>
                                            ) : user.institution ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                                                        <Building className="w-4 h-4 text-slate-400" /> {user.institution}
                                                    </span>
                                                    <span className="text-xs text-slate-500 mt-1">
                                                        {user.school || user.department || "No department listed"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">No academic data</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role === 'admin' ? (
                                                <span className="text-xs font-semibold text-slate-400 flex items-center justify-end gap-1 px-2">
                                                    <ShieldAlert className="w-3.5 h-3.5" /> Superuser
                                                </span>
                                            ) : (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    disabled={updatingId === user.id}
                                                    onClick={() => handleToggleSuspension(user.id, user.status === 'suspended')}
                                                    className={user.status === 'suspended' ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs h-8" : "text-amber-500 hover:text-amber-600 hover:bg-amber-50 text-xs h-8 font-medium"}
                                                >
                                                    {updatingId === user.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                                    ) : user.status === 'suspended' ? (
                                                        <><Check className="w-3.5 h-3.5 mr-1" /> Restore Access</>
                                                    ) : (
                                                        <><Ban className="w-3.5 h-3.5 mr-1" /> Suspend Access</>
                                                    )}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                
                                {profiles.filter(p => activeTab === 'active' ? p.status !== 'suspended' : p.status === 'suspended').length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            {activeTab === 'active' ? 'No active users found.' : 'No suspended accounts.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
