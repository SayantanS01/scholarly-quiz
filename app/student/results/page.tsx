import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import Link from 'next/link'

export default async function StudentResultsPage() {
  const session = await getSession()
  const userId = session?.userId

  const attempts = await prisma.attempt.findMany({
    where: { studentId: userId },
    orderBy: { completedAt: 'desc' },
    include: { quiz: true }
  })

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">My Results</h1>
        <p className="text-slate-400">Track your progress and review your scores</p>
      </header>

      <div className="glass overflow-hidden rounded-2xl border-0">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-sm font-semibold border-b border-white/10">
              <th className="px-8 py-4">Quiz</th>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4 text-center">Score</th>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4 text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {attempts.map((attempt: any) => (
              <tr key={attempt.id} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-bold text-white">{attempt.quiz.title}</div>
                </td>
                <td className="px-8 py-6 text-slate-400 text-sm">{attempt.quiz.category || 'General'}</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1 rounded-full text-sm font-black ${
                    attempt.score >= 70 ? 'bg-green-500/10 text-green-400' : 
                    attempt.score >= 40 ? 'bg-orange-500/10 text-orange-400' : 
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {attempt.score}%
                  </span>
                </td>
                <td className="px-8 py-6 text-slate-400 text-sm">
                  {new Date(attempt.completedAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  {!attempt.quiz.isLocked ? (
                    <Link 
                      href={`/student/results/${attempt.id}`} 
                      className="text-brand-primary hover:underline font-bold text-sm"
                    >
                      REVIEW
                    </Link>
                  ) : (
                    <span className="text-slate-600 text-xs font-bold uppercase tracking-widest cursor-help" title="Locked by Teacher">
                      LOCKED 🔒
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {attempts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-500">
                  You haven&apos;t completed any quizzes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
