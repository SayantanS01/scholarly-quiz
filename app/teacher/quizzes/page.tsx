import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import Link from 'next/link'
import { deleteQuiz } from '@/app/actions/quiz'

export default async function TeacherQuizzesPage() {
  const session = await getSession()
  const userId = session?.userId

  const quizzes = await prisma.quiz.findMany({
    where: { creatorId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { questions: true, attempts: true }
      }
    }
  })

  async function handleDelete(formData: FormData) {
    'use server'
    const quizId = formData.get('quizId') as string
    await deleteQuiz(quizId)
  }

  return (
    <div>
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 text-primary font-bold tracking-tighter">MODULE_REPOSITORY</h1>
          <p className="text-primary font-mono text-xs uppercase tracking-[0.3em]">Total Created Modules: {quizzes.length}</p>
        </div>
        <Link href="/teacher/quizzes/new" className="btn-primary border-primary text-primary hover:bg-primary/10">
          + NEW_MODULE
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {quizzes.map((quiz: any) => (
          <div key={quiz.id} className="card-panel p-8 panel-border border-primary flex flex-col group hover:border-primary transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-black text-primary tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                // {quiz.category || 'GENERAL_CORE'}
              </span>
              <form action={handleDelete}>
                <input type="hidden" name="quizId" value={quiz.id} />
                <button className="text-slate-700 hover:text-red-500 transition-colors text-xs font-black">
                  [ TERMINATE ]
                </button>
              </form>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors tracking-tight">
              {quiz.title}
            </h3>
            <p className="text-slate-500 font-mono text-xs mb-8 line-clamp-2 flex-1 leading-relaxed">
              {quiz.description || 'Module data stream operational. No meta-description provided.'}
            </p>

            <div className="flex items-center gap-6 text-[10px] font-black text-slate-600 border-t border-white/5 pt-6 group-hover:text-slate-400 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-primary">#</span> {quiz._count.questions} QUESTIONS
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">#</span> {quiz._count.attempts} ATTEMPTS
              </div>
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <div className="col-span-full py-32 text-center card-panel panel-border border-dashed border-slate-800">
            <div className="text-4xl mb-4 opacity-20">NULL_SET</div>
            <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">No educational modules detected in local node.</p>
          </div>
        )}
      </div>
    </div>
  )
}
