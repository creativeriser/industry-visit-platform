import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://yoglngdanhbybmrounaz.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvZ2xuZ2RhbmhieWJtcm91bmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzI4MDQsImV4cCI6MjA4NjY0ODgwNH0.P9bQveeMVPI3GzywNajPul3K-Yip6Wc63GeY_kyqu10"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function deleteAllVisits() {
  const { data, error } = await supabase
    .from('scheduled_visits')
    .delete()
    .not('id', 'is', null) // Deletes all rows

  if (error) {
    console.error('Error deleting:', error)
  } else {
    console.log('Successfully deleted all scheduled visits.')
  }
}

deleteAllVisits()
