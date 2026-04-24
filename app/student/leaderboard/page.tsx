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

  const leaderboard = users.map((user: any) => {
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
        <h1 className="text-4xl font-black text-white mb-2 neon-text tracking-tighter">RANKING_BOARD</h1>
        <p className="text-neon-cyan font-mono text-xs uppercase tracking-[0.3em]">Top Performers in Network</p>
      </header>

      <div className="glass-panel cyber-border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10">
          {leaderboard.slice(0, 3).map((user, i) => (
            <div key={user.name} className="p-12 text-center flex flex-col items-center group hover:bg-neon-cyan/5 transition-all">
              <div className={`text-6xl mb-6 transition-transform duration-500 ${i === 0 ? 'scale-125' : 'group-hover:scale-110'}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{user.name}</h3>
              <div className="text-neon-cyan font-black text-5xl mb-6 neon-text">{user.avgScore}%</div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                {user.totalQuizzes} NODES_PROCESSED
              </div>
            </div>
          ))}
        </div>

        <div className="p-8">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="text-neon-cyan text-[10px] font-black tracking-[0.3em] uppercase border-b border-white/5">
                <th className="pb-6 px-4">RANK</th>
                <th className="pb-6 px-4">IDENTITY</th>
                <th className="pb-6 px-4 text-center">PRECISION</th>
                <th className="pb-6 px-4 text-right">VOLUME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.slice(3).map((user, i) => (
                <tr key={user.name} className="hover:bg-neon-magenta/5 transition-colors group">
                  <td className="py-6 px-4 text-slate-500 font-bold tracking-tighter">#{i + 4}</td>
                  <td className="py-6 px-4 font-black text-white group-hover:text-neon-magenta transition-colors uppercase">{user.name}</td>
                  <td className="py-6 px-4 text-center">
                    <span className="text-neon-cyan font-black">{user.avgScore}%</span>
                  </td>
                  <td className="py-6 px-4 text-right text-slate-500 text-xs">
                    {user.totalQuizzes} DATA_UNITS
                  </td>
                </tr>
              ))}
              {leaderboard.length <= 3 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-700 text-xs uppercase tracking-widest">
                    ADDITIONAL_NODES_PENDING_CALIBRATION
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
