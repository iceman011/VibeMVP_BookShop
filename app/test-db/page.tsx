import { createServerSupabaseClient } from '@/lib/supabase'

export default async function TestDB() {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      {error ? (
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-800">Error: {error.message}</p>
        </div>
      ) : (
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-800">✅ Database connected!</p>
        </div>
      )}
    </div>
  )
}