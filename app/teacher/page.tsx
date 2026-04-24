import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export default async function TeacherDashboard() {
  const session = await getSession()
  const userId = session?.userId

  const [quizCount, studentCount, attemptCount] = await Promise.all([
    prisma.quiz.count({ where: { creatorId: userId } }),
    prisma.user.count({ where: { role: 'STUDENT' } }), // Total students for now
    prisma.attempt.count({ where: { quiz: { creatorId: userId } } }),
  ])

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Teacher Dashboard</h1>
        <p className="text-slate-400">Manage your quizzes and track student performance</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="My Quizzes" value={quizCount} icon="📝" color="blue" />
        <StatCard title="Total Students" value={studentCount} icon="🎓" color="purple" />
        <StatCard title="Total Attempts" value={attemptCount} icon="📈" color="pink" />
      </div>

      <div className="glass p-8 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard title="Create New Quiz" description="Build a new assessment with multiple questions." icon="➕" href="/teacher/quizzes/new" />
          <ActionCard title="Review Attempts" description="Check and grade student submissions." icon="🔍" href="/teacher/attempts" />
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
  }

  return (
    <div className={`p-8 panel-border ${colors[color]} bg-card/50`}>
      <div className="text-4xl mb-4">{icon}</div>
      <div className="text-sm font-medium opacity-70 mb-1 tracking-wider uppercase">{title}</div>
      <div className="text-4xl font-bold text-white">{value}</div>
    </div>
  )
}

import Link from 'next/link'
function ActionCard({ title, description, icon, href }: { title: string; description: string; icon: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-6 p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
      <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</div>
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </Link>
  )
}
