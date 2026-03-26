// test-db.js
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Baca .env.local manual
const env = fs.readFileSync('.env.local', 'utf8')
env.split('\n').forEach(line => {
  const [key, ...val] = line.split('=')
  if (key && val.length) process.env[key.trim()] = val.join('=').trim()
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Key:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 30) + '...')

  const { data, error } = await supabase
    .from('research_items')
    .insert({
      title: 'Test Paper',
      source: 'Test',
      url: 'https://test.com/' + Date.now(),
      published_at: new Date().toISOString(),
      field: 'ai',
      summary_ai: 'Test summary',
      summary_original: 'Test',
      relevance_score: 50,
      is_featured: false
    })
    .select()

  if (error) {
    console.error('❌ INSERT FAILED:', error.message)
    console.error('   Code:', error.code)
    console.error('   Details:', error.details)
  } else {
    console.log('✅ INSERT SUCCESS! Data tersimpan:', data?.[0]?.id)
  }
}

test()