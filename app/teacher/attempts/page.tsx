import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export default async function TeacherAttemptsPage() {
  const session = await getSession()
  const userId = session?.userId

  const attempts = await prisma.attempt.findMany({
    where: { quiz: { creatorId: userId } },
    orderBy: { completedAt: 'desc' },
    include: {
      quiz: true,
      student: { select: { name: true, email: true } }
    }
  })

  async function deleteAttempt(formData: FormData) {
    'use server'
    const attemptId = formData.get('attemptId') as string
    await prisma.attempt.delete({ where: { id: attemptId } })
    revalidatePath('/teacher/attempts')
  }

  async function toggleReview(formData: FormData) {
    'use server'
    const quizId = formData.get('quizId') as string
    const isLocked = formData.get('isLocked') === 'true'
    await prisma.quiz.update({
      where: { id: quizId },
      data: { isLocked: !isLocked }
    })
    revalidatePath('/teacher/attempts')
  }

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Student Attempts</h1>
        <p className="text-slate-400">Review submissions and manage student progress</p>
      </header>

      <div className="glass overflow-hidden rounded-2xl border-0">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-sm font-semibold border-b border-white/10">
              <th className="px-8 py-4">Student</th>
              <th className="px-8 py-4">Quiz</th>
              <th className="px-8 py-4 text-center">Score</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {attempts.map((attempt: any) => (
              <tr key={attempt.id} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-bold text-white">{attempt.student.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{attempt.student.email}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-white font-medium">{attempt.quiz.title}</div>
                  <form action={toggleReview} className="mt-2">
                    <input type="hidden" name="quizId" value={attempt.quiz.id} />
                    <input type="hidden" name="isLocked" value={String(attempt.quiz.isLocked)} />
                    <button className={`text-[10px] font-black tracking-tighter px-2 py-1 rounded border transition-colors ${
                      attempt.quiz.isLocked ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border-green-500/50 text-green-400 hover:bg-green-500/10'
                    }`}>
                      {attempt.quiz.isLocked ? 'REVIEW LOCKED 🔒' : 'REVIEW UNLOCKED 🔓'}
                    </button>
                  </form>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`text-xl font-black ${attempt.score >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                    {attempt.score}%
                  </span>
                </td>
                <td className="px-8 py-6 text-slate-400 text-sm italic">
                  {new Date(attempt.completedAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <form action={deleteAttempt}>
                    <input type="hidden" name="attemptId" value={attempt.id} />
                    <button 
                      className="text-red-400 hover:text-red-300 font-bold text-xs px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-all"
                      onClick={(e) => {
                        if (!confirm('Delete this attempt? This cannot be undone.')) e.preventDefault()
                      }}
                    >
                      DELETE
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {attempts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-500">
                  No attempts recorded for your quizzes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
