'use client'

import { useActionState, useState } from 'react'
import { signup } from '@/app/actions/auth'
import Link from 'next/link'

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined)
  const [role, setRole] = useState('STUDENT')

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="card-panel p-10 panel-border w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-[10px] text-primary font-mono opacity-20">REG_NODE_v1.0</div>
        
        <h2 className="text-4xl font-black mb-2 text-white tracking-tighter text-primary font-bold">INIT_REGISTRATION</h2>
        <p className="text-slate-500 font-mono text-xs mb-10 tracking-widest uppercase">Generate new encrypted identity</p>

        <form action={action} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-primary mb-2 uppercase tracking-[0.2em]">FULL_NAME</label>
            <input 
              name="name" 
              type="text" 
              placeholder="IDENTITY_STRING"
              className="w-full px-4 py-4 bg-black border border-slate-800 text-white font-mono text-sm focus:border-primary outline-none transition-all placeholder:text-slate-800"
              required
            />
            {state?.errors?.name && <p className="text-primary text-[10px] mt-1 font-bold">{state.errors.name}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black text-primary mb-2 uppercase tracking-[0.2em]">IDENTIFIER_EMAIL</label>
            <input 
              name="email" 
              type="email" 
              placeholder="NAME@DOMAIN.COM"
              className="w-full px-4 py-4 bg-black border border-slate-800 text-white font-mono text-sm focus:border-primary outline-none transition-all placeholder:text-slate-800"
              required
            />
            {state?.errors?.email && <p className="text-primary text-[10px] mt-1 font-bold">{state.errors.email}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black text-primary mb-2 uppercase tracking-[0.2em]">PASS_KEY</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-4 bg-black border border-slate-800 text-white font-mono text-sm focus:border-primary outline-none transition-all placeholder:text-slate-800"
              required
            />
            {state?.errors?.password && <p className="text-primary text-[10px] mt-1 font-bold">{state.errors.password}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black text-primary mb-2 uppercase tracking-[0.2em]">NODE_TYPE</label>
            <select 
              name="role" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-4 bg-black border border-slate-800 text-white font-mono text-sm focus:border-primary outline-none transition-all appearance-none"
            >
              <option value="STUDENT">STUDENT_CORE</option>
              <option value="TEACHER">INSTRUCTOR_NODE</option>
            </select>
          </div>

          {role === 'TEACHER' && (
            <div className="animate-pulse">
              <label className="block text-[10px] font-black text-primary mb-2 uppercase tracking-[0.2em]">INVITATION_TOKEN</label>
              <input 
                name="teacherToken" 
                type="text" 
                placeholder="X5-J9-B2"
                className="w-full px-4 py-4 bg-black border border-primary text-primary font-mono text-sm focus:border-primary outline-none transition-all placeholder:text-primary/20"
                required={role === 'TEACHER'}
              />
              <p className="text-[8px] text-primary/60 mt-1 font-mono uppercase tracking-widest">Admin-issued token required for instructor sync</p>
            </div>
          )}

          {state?.message && (
            <div className="p-4 bg-neon-magenta/10 border border-primary text-primary text-xs font-bold uppercase tracking-widest">
              &gt; ERROR: {state.message}
            </div>
          )}

          <button 
            disabled={pending}
            type="submit" 
            className="btn-primary w-full py-4 text-sm font-black"
          >
            {pending ? '[ ENCRYPTING... ]' : '[ GENERATE_IDENTITY ]'}
          </button>
        </form>

        <p className="mt-10 text-center text-slate-600 font-mono text-[10px] tracking-widest uppercase">
          Identity already exists?{' '}
          <Link href="/login" className="text-primary hover:text-white transition-colors font-black">
            [ INIT_LOGIN ]
          </Link>
        </p>
      </div>
    </div>
  )
}
