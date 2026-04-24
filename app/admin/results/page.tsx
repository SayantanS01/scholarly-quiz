import { prisma } from '@/lib/prisma'

export default async function AdminResultsPage() {
  const attempts = await prisma.attempt.findMany({
    orderBy: { completedAt: 'desc' },
    include: {
      quiz: true,
      student: { select: { name: true } }
    }
  })

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2 neon-text tracking-tighter">GLOBAL_ANALYTICS</h1>
        <p className="text-neon-cyan font-mono text-xs uppercase tracking-[0.3em]">Total Processed Attempts: {attempts.length}</p>
      </header>

      <div className="glass-panel cyber-border overflow-hidden">
        <table className="w-full text-left font-mono">
          <thead>
            <tr className="bg-white/5 text-neon-cyan text-xs font-black tracking-widest border-b border-neon-cyan/20">
              <th className="px-8 py-4">SUBJECT_NODE</th>
              <th className="px-8 py-4">MODULE</th>
              <th className="px-8 py-4 text-center">PRECISION</th>
              <th className="px-8 py-4 text-right">TIMESTAMP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {attempts.map((attempt: any) => (
              <tr key={attempt.id} className="hover:bg-neon-magenta/5 transition-colors">
                <td className="px-8 py-6 font-bold text-white uppercase">{attempt.student.name}</td>
                <td className="px-8 py-6 text-slate-400 text-sm">{attempt.quiz.title}</td>
                <td className="px-8 py-6 text-center">
                  <span className={`font-black ${attempt.score >= 70 ? 'text-neon-cyan' : 'text-neon-magenta'}`}>
                    {attempt.score}%
                  </span>
                </td>
                <td className="px-8 py-6 text-right text-slate-500 text-xs">
                  {new Date(attempt.completedAt).toISOString().split('T')[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
