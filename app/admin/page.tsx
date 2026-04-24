import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [userCount, teacherCount, studentCount, quizCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.quiz.count(),
    prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
  ])

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2 neon-text tracking-tighter">ADMIN_OVERVIEW</h1>
        <p className="text-neon-cyan font-mono text-xs uppercase tracking-[0.3em]">System status: healthy</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="TOTAL_NODES" value={userCount} icon="👥" color="blue" />
        <StatCard title="INSTRUCTORS" value={teacherCount} icon="👨‍🏫" color="purple" />
        <StatCard title="STUDENTS" value={studentCount} icon="🎓" color="pink" />
        <StatCard title="DATA_MODULES" value={quizCount} icon="📝" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 cyber-border">
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight uppercase">RECENT_NODES</h3>
          <div className="space-y-4">
            {recentUsers.map((user: any) => (
              <div key={user.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 hover:border-neon-cyan/30 transition-all">
                <div>
                  <div className="text-sm font-bold text-white uppercase">{user.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{user.email}</div>
                </div>
                <div className={`text-[9px] font-black px-2 py-1 border ${
                  user.role === 'ADMIN' ? 'border-neon-magenta text-neon-magenta' : 
                  user.role === 'TEACHER' ? 'border-neon-yellow text-neon-yellow' : 
                  'border-neon-cyan text-neon-cyan'
                }`}>
                  {user.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 cyber-border">
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight uppercase">SYSTEM_STATUS</h3>
          <div className="space-y-4">
            <StatusItem label="DATABASE_SYNC" status="CONNECTED" color="green" />
            <StatusItem label="NEURAL_AUTH" status="OPERATIONAL" color="green" />
            <StatusItem label="ACCELERATE_CORE" status="OPTIMIZED" color="green" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  }

  return (
    <div className={`p-6 cyber-border ${colors[color]} bg-black/40`}>
      <div className="text-3xl mb-4">{icon}</div>
      <div className="text-[10px] font-mono opacity-70 mb-1 uppercase tracking-widest">{title}</div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  )
}

function StatusItem({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
      <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse`}></div>
        <span className="text-neon-cyan text-[10px] font-black uppercase tracking-widest">{status}</span>
      </div>
    </div>
  )
}
