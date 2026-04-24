'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-cyber-black">
      <div className="glass-panel p-10 cyber-border w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-[10px] text-neon-cyan font-mono opacity-20">AUTH_SEC_v4.2</div>
        
        <h2 className="text-4xl font-black mb-2 text-white tracking-tighter neon-text">INIT_LOGIN</h2>
        <p className="text-slate-500 font-mono text-xs mb-10 tracking-widest uppercase">Enter access credentials to proceed</p>

        <form action={action} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-neon-cyan mb-2 uppercase tracking-[0.2em]">IDENTIFIER</label>
            <input 
              name="email" 
              type="email" 
              placeholder="NAME@DOMAIN.COM"
              className="w-full px-4 py-4 bg-black border border-slate-800 text-white font-mono text-sm focus:border-neon-cyan outline-none transition-all placeholder:text-slate-800"
              required
            />
            {state?.errors?.email && <p className="text-neon-magenta text-[10px] mt-1 font-bold">{state.errors.email}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black text-neon-cyan mb-2 uppercase tracking-[0.2em]">PASS_KEY</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-4 bg-black border border-slate-800 text-white font-mono text-sm focus:border-neon-cyan outline-none transition-all placeholder:text-slate-800"
              required
            />
            {state?.errors?.password && <p className="text-neon-magenta text-[10px] mt-1 font-bold">{state.errors.password}</p>}
          </div>

          {state?.message && (
            <div className="p-4 bg-neon-magenta/10 border border-neon-magenta/50 text-neon-magenta text-xs font-bold uppercase tracking-widest">
              &gt; ERROR: {state.message}
            </div>
          )}

          <button 
            disabled={pending}
            type="submit" 
            className="btn-cyber w-full py-4 text-sm font-black"
          >
            {pending ? '[ AUTHORIZING... ]' : '[ ACCESS_SYSTEM ]'}
          </button>
        </form>

        <p className="mt-10 text-center text-slate-600 font-mono text-[10px] tracking-widest uppercase">
          No identity found?{' '}
          <Link href="/signup" className="text-neon-magenta hover:text-white transition-colors font-black">
            [ REGISTER_NODE ]
          </Link>
        </p>
      </div>
    </div>
  )
}
