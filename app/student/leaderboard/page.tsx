import { prisma } from '@/lib/prisma'

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      attempts: {
        select: { score: true }
      }
    }
  })

  const leaderboard = users.map(user => {
    const totalScore = user.attempts.reduce((sum: number, a: any) => sum + a.score, 0)
    const avgScore = user.attempts.length > 0 ? totalScore / user.attempts.length : 0
    return {
      name: user.name,
      avgScore: Math.round(avgScore),
      totalQuizzes: user.attempts.length
    }
  }).sort((a, b) => b.avgScore - a.avgScore)

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Global Leaderboard</h1>
        <p className="text-slate-400">See who leads in academic excellence</p>
      </header>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {leaderboard.slice(0, 3).map((user, i) => (
            <div key={user.name} className="p-10 text-center flex flex-col items-center">
              <div className={`text-5xl mb-4 ${i === 0 ? 'scale-125' : ''}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{user.name}</h3>
              <div className="text-brand-primary font-black text-4xl mb-4">{user.avgScore}%</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                {user.totalQuizzes} Quizzes Completed
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 p-8 border-t border-white/10">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs font-black tracking-widest uppercase border-b border-white/5">
                <th className="pb-4 px-4">Rank</th>
                <th className="pb-4 px-4">Student</th>
                <th className="pb-4 px-4 text-center">Avg Score</th>
                <th className="pb-4 px-4 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.slice(3).map((user, i) => (
                <tr key={user.name} className="hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 text-slate-400 font-bold">#{i + 4}</td>
                  <td className="py-6 px-4 font-bold text-white">{user.name}</td>
                  <td className="py-6 px-4 text-center">
                    <span className="text-brand-primary font-black">{user.avgScore}%</span>
                  </td>
                  <td className="py-6 px-4 text-right text-slate-500 text-sm">
                    {user.totalQuizzes} Quizzes
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
