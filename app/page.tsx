import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <main className="relative z-10 text-center px-6">
        <div className="mb-4 inline-block px-3 py-1 bg-neon-magenta text-black text-[10px] font-black tracking-[0.3em] uppercase animate-pulse">
          // ACADEMIC_SYSTEM_V4.0
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter text-white">
          <span className="text-primary font-bold text-primary">SCHOLARLY</span>
          <br />
          <span className="text-primary font-bold text-primary">QUIZ</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 font-mono uppercase tracking-widest">
          The ultimate platform for academic excellence. 
          Challenge your knowledge, track your progress, and lead the board.
        </p>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <Link href="/login" className="btn-primary text-lg px-12 py-4">
            INIT_SESSION
          </Link>
          <Link href="/signup" className="px-8 py-3 border border-primary text-primary font-mono text-xs tracking-[0.2em] hover:bg-primary/10 hover:text-black transition-all">
            [ CREATE_ENCRYPTED_ACCOUNT ]
          </Link>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
          <CyberCard 
            title="FOR_STUDENTS" 
            description="Take interactive quizzes, review your performance, and climb the global leaderboard."
            label="ID_STUDENT"
          />
          <CyberCard 
            title="FOR_TEACHERS" 
            description="Create custom assessments, monitor student progress, and provide detailed feedback."
            label="ID_TEACHER"
          />
          <CyberCard 
            title="FOR_ADMINS" 
            description="Complete control over users, roles, and platform integrity."
            label="ID_ADMIN"
          />
        </div>
      </main>
    </div>
  )
}

function CyberCard({ title, description, label }: { title: string; description: string; label: string }) {
  return (
    <div className="card-panel p-8 panel-border group hover:bg-primary/10 transition-all duration-500">
      <div className="text-[10px] font-mono text-primary mb-4 opacity-50 group-hover:opacity-100">{label}</div>
      <h3 className="text-2xl font-black mb-3 text-white tracking-tight">{title}</h3>
      <p className="text-slate-500 font-mono text-sm leading-relaxed group-hover:text-slate-300">{description}</p>
      <div className="mt-6 h-px w-0 bg-neon-cyan group-hover:w-full transition-all duration-700"></div>
    </div>
  )
}
