import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        // Delete all visit_applications
        const { error: e1 } = await supabase.from('visit_applications').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all
        
        // Delete all scheduled_visits
        const { error: e2 } = await supabase.from('scheduled_visits').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        
        if (e1) throw e1
        if (e2) throw e2

        return NextResponse.json({ success: true, message: "Cleared old database entries." })
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message })
    }
}
