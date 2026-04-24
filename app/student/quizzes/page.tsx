import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function StudentQuizzesPage() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      creator: { select: { name: true } },
      _count: { select: { questions: true } }
    }
  })

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2 text-primary font-bold tracking-tighter">KNOWLEDGE_MODULES</h1>
        <p className="text-primary font-mono text-xs uppercase tracking-[0.3em]">Available Uplinks: {quizzes.length}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz: any) => (
          <div key={quiz.id} className="card-panel p-8 panel-border hover:border-primary transition-all duration-500 group flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">
                // {quiz.category || 'GENERAL_CORE'}
              </span>
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                NODE: {quiz.creator.name}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-primary font-bold transition-all">{quiz.title}</h3>
            <p className="text-slate-500 font-mono text-xs mb-10 line-clamp-3 h-15 leading-relaxed group-hover:text-slate-400 transition-colors">
              {quiz.description || 'Module stream ready for neural sync. High-priority assessment protocol.'}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {quiz._count.questions} DATA_POINTS
              </span>
              <Link href={`/student/quizzes/${quiz.id}`} className="btn-primary py-2 px-6 text-[10px]">
                INIT_SYNC
              </Link>
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <div className="col-span-full py-32 text-center card-panel panel-border text-slate-600 font-mono text-xs uppercase tracking-widest">
            NO_MODULES_FOUND_IN_NETWORK_RADIUS
          </div>
        )}
      </div>
    </div>
  )
}
