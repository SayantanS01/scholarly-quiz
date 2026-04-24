'use client'

import { useState } from 'react'
import { generateTeacherToken } from '@/app/actions/admin'

export default function TokenGenerator() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const newToken = await generateTeacherToken()
      setToken(newToken)
    } catch (err) {
      alert('Failed to generate token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel p-6 cyber-border border-neon-magenta/30 bg-black/40">
      <h4 className="text-[10px] font-black text-neon-magenta mb-4 uppercase tracking-[0.2em]">INSTRUCTOR_INVITE_PROTOCOL</h4>
      
      {!token ? (
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 border border-neon-magenta text-neon-magenta text-[10px] font-black uppercase tracking-widest hover:bg-neon-magenta hover:text-black transition-all"
        >
          {loading ? '[ GENERATING... ]' : '[ GENERATE_10MIN_TOKEN ]'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-neon-magenta/10 border border-neon-magenta/50 p-4 text-center">
            <div className="text-[10px] text-neon-magenta/60 mb-1 uppercase font-mono">SECURE_TOKEN</div>
            <div className="text-2xl font-black text-white tracking-widest">{token}</div>
          </div>
          <p className="text-[8px] text-slate-500 font-mono text-center uppercase tracking-widest">Expires in 10 minutes. Transmit to instructor immediately.</p>
          <button 
            onClick={() => setToken(null)}
            className="w-full text-slate-700 text-[9px] font-black hover:text-white transition-colors"
          >
            [ CLEAR_DISPLAY ]
          </button>
        </div>
      )}
    </div>
  )
}
