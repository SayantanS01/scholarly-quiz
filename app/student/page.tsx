import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import Link from 'next/link'

export default async function StudentDashboard() {
  const session = await getSession()
  const userId = session?.userId

  const [availableQuizzes, recentAttempts] = await Promise.all([
    prisma.quiz.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { isLocked: false } // Assuming locked means not available for taking yet? 
      // Actually, let's use isLocked for "review locked", and maybe a different field for "published".
      // For now, let's just fetch all.
    }),
    prisma.attempt.findMany({
      where: { studentId: userId },
      take: 5,
      orderBy: { completedAt: 'desc' },
      include: { quiz: true }
    }),
  ])

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Student Dashboard</h1>
        <p className="text-slate-400">Welcome back! Ready for a challenge?</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Quizzes */}
        <div className="glass p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Available Quizzes</h3>
            <Link href="/student/quizzes" className="text-brand-primary text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {availableQuizzes.map((quiz: any) => (
              <div key={quiz.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                <div>
                  <h4 className="text-white font-bold">{quiz.title}</h4>
                  <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">{quiz.category || 'General'}</p>
                </div>
                <Link href={`/student/quizzes/${quiz.id}`} className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-bold">
                  START
                </Link>
              </div>
            ))}
            {availableQuizzes.length === 0 && <p className="text-slate-500 text-center py-4">No quizzes available right now.</p>}
          </div>
        </div>

        {/* Recent Results */}
        <div className="glass p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Results</h3>
            <Link href="/student/results" className="text-brand-primary text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentAttempts.map((attempt: any) => (
              <div key={attempt.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <h4 className="text-white font-bold">{attempt.quiz.title}</h4>
                  <p className="text-slate-500 text-xs mt-1">{new Date(attempt.completedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black ${attempt.score >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                    {attempt.score}%
                  </div>
                </div>
              </div>
            ))}
            {recentAttempts.length === 0 && <p className="text-slate-500 text-center py-4">You haven&apos;t taken any quizzes yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
