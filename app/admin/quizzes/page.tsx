import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { deleteQuiz } from '@/app/actions/quiz'

export default async function AdminQuizzesPage() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      creator: { select: { name: true } },
      _count: { select: { questions: true, attempts: true } }
    }
  })

  async function handleDelete(formData: FormData) {
    'use server'
    const quizId = formData.get('quizId') as string
    await deleteQuiz(quizId)
  }

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2 text-primary font-bold tracking-tighter">DATA_MODULES_INDEX</h1>
        <p className="text-primary font-mono text-xs uppercase tracking-[0.3em]">Total Active Modules: {quizzes.length}</p>
      </header>

      <div className="card-panel panel-border overflow-hidden">
        <table className="w-full text-left font-mono">
          <thead>
            <tr className="bg-white/5 text-primary text-xs font-black tracking-widest border-b border-primary">
              <th className="px-8 py-4">MODULE_ID</th>
              <th className="px-8 py-4">CREATOR_NODE</th>
              <th className="px-8 py-4 text-center">INTEGRITY</th>
              <th className="px-8 py-4 text-right">OPERATIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {quizzes.map((quiz: any) => (
              <tr key={quiz.id} className="hover:bg-primary/10 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-bold text-white uppercase">{quiz.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{quiz.id}</div>
                </td>
                <td className="px-8 py-6 text-slate-400 text-sm">{quiz.creator.name}</td>
                <td className="px-8 py-6 text-center">
                  <span className="text-primary font-black">{quiz._count.questions} Q</span>
                  <span className="mx-2 text-slate-700">|</span>
                  <span className="text-primary font-black">{quiz._count.attempts} A</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <form action={handleDelete}>
                    <input type="hidden" name="quizId" value={quiz.id} />
                    <button className="text-red-500 hover:text-white font-black text-xs tracking-widest transition-colors">
                      [ DELETE_MODULE ]
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
