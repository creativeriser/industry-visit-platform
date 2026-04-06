const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').filter(l => l.trim() && !l.startsWith('#')).forEach(l => {
    const [k, ...v] = l.split('=');
    env[k.trim()] = v.join('=').trim().replace(/^"|"$/g, '');
});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);
(async () => {
    const {data, error} = await supabase.from('scheduled_visits').select('id, company_id, status, hr_notes, company:companies(id, name)');
    if (error) console.error(error);
    console.log(JSON.stringify(data, null, 2));
})();
