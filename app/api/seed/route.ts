import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { COMPANIES } from '@/lib/companies'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const secret = searchParams.get('secret')

        // Simple protection: Check for a secret key
        if (secret !== process.env.Create_SEED_SECRET && secret !== 'my-secure-seed-phrase') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Option 1: Upsert (Update if exists, Insert if new) based on 'id' if we want to preserve IDs
        // Note: 'id' in mock data is number, expected to match 'id' in DB (serial or int).
        // Since 'id' is distinct key, this works well for initial seed.

        const { data, error } = await supabase
            .from('companies')
            .upsert(COMPANIES, { onConflict: 'id' })
            .select()

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: `Scaled database with ${data.length} entries.`,
            data
        })
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
