import { createClient } from '@supabase/supabase-js'; 
import dotenv from 'dotenv'; dotenv.config({path: '.env.local'});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
    const { data, error } = await supabase.from('scheduled_visits').select('id, company_id, status, hr_notes, company:companies(id, name)');
    if (error) console.error(error);
    data.forEach(v => console.log('visit id:', v.id, 'company_id:', v.company_id, 'company obj:', v.company));
}
test();
