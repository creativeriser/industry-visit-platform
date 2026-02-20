import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .limit(5)

        return NextResponse.json({
            success: !error,
            count: data?.length || 0,
            users: data,
            error: error?.message
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
