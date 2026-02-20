'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function VerifyDataPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                setProfile(data)
            }
            setLoading(false)
        }
        load()
    }, [])

    if (loading) return <div className="p-10">Loading database record...</div>

    return (
        <div className="p-10 max-w-2xl mx-auto font-sans">
            <h1 className="text-2xl font-bold mb-4">Database Verification</h1>
            <p className="mb-6 text-slate-600">
                This data is pulled directly from the <code className="bg-slate-100 px-1 rounded text-pink-600">public.profiles</code> table,
                where your school, department, and phone details are stored.
            </p>

            <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 overflow-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200">
                        <tr>
                            <th className="py-2 font-bold text-slate-500">Column</th>
                            <th className="py-2 font-bold text-slate-900">Stored Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        <tr>
                            <td className="py-3 text-slate-500">full_name</td>
                            <td className="py-3 font-mono text-indigo-700 font-bold">{profile?.full_name || '(empty)'}</td>
                        </tr>
                        <tr>
                            <td className="py-3 text-slate-500">school</td>
                            <td className="py-3 font-mono">{profile?.school || '(empty)'}</td>
                        </tr>
                        <tr>
                            <td className="py-3 text-slate-500">department</td>
                            <td className="py-3 font-mono">{profile?.department || '(empty)'}</td>
                        </tr>
                        <tr>
                            <td className="py-3 text-slate-500">designation</td>
                            <td className="py-3 font-mono">{profile?.designation || '(empty)'}</td>
                        </tr>
                        <tr>
                            <td className="py-3 text-slate-500">phone</td>
                            <td className="py-3 font-mono">{profile?.phone || '(empty)'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                <strong>Note to Developer:</strong> The "Authentication" tab in Supabase Dashboard ONLY shows login credentials.
                It does not show these custom fields. To see these in Supabase, you must go to
                <strong> Table Editor</strong> &rarr; <strong>profiles</strong> table.
            </div>

            <pre className="mt-6 text-xs text-slate-400">
                {JSON.stringify(profile, null, 2)}
            </pre>
        </div>
    )
}
