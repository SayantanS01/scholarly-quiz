import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cyber-black font-mono">
      {/* Sidebar */}
      <aside className="w-72 bg-black border-r border-neon-magenta/20 fixed inset-y-0 z-50 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(var(--neon-magenta)_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="p-8 mb-8">
          <Link href="/teacher" className="text-2xl font-black neon-text-magenta text-neon-magenta tracking-tighter">
            TEACHER_OS
          </Link>
          <div className="text-[10px] text-neon-cyan font-black mt-1">MODE: INSTRUCTOR_CORE</div>
        </div>
        
        <nav className="px-6 space-y-4">
          <SidebarLink href="/teacher" label="DASHBOARD" />
          <SidebarLink href="/teacher/quizzes" label="QUIZ_MANAGER" />
          <SidebarLink href="/teacher/assignments" label="ASSIGNMENTS" />
          <SidebarLink href="/teacher/attempts" label="STUDENT_STATS" />
        </nav>

        <div className="absolute bottom-10 left-0 right-0 px-6">
          <form action={logout}>
            <button className="w-full text-left py-3 px-4 border border-red-500/30 text-red-500 text-xs font-black tracking-widest hover:bg-red-500 hover:text-black transition-all">
              [ EXIT_SYSTEM ]
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12 bg-[rgba(15,10,15,0.8)] relative">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))] [background-size:100%_2px,3px_100%]"></div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="block py-3 px-4 border border-transparent hover:border-neon-magenta/50 hover:text-neon-magenta transition-all text-sm font-bold tracking-widest text-slate-500 group"
    >
      <span className="opacity-0 group-hover:opacity-100 mr-2 transition-opacity">&gt;</span> {label}
    </Link>
  )
}
