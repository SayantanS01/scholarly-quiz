import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { notFound, redirect } from 'next/navigation'

export default async function ResultReviewPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const session = await getSession()

  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: {
      quiz: {
        include: { questions: true }
      }
    }
  })

  if (!attempt) notFound()

  // Authorization check
  if (attempt.studentId !== session?.userId) {
    redirect('/student/results')
  }

  // Locked check
  if (attempt.quiz.isLocked) {
    redirect('/student/results')
  }

  const userAnswers = JSON.parse(attempt.answers)

  return (
    <div className="max-w-4xl mx-auto py-10">
      <header className="mb-12 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black tracking-widest mb-4">
          REVIEW SESSION
        </div>
        <h1 className="text-4xl font-black text-white mb-2">{attempt.quiz.title}</h1>
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <div className="text-3xl font-black text-white">{attempt.score}%</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Final Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-white">{new Date(attempt.completedAt).toLocaleDateString()}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Date Taken</div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {attempt.quiz.questions.map((q: any, i: number) => {
          const userAnswer = userAnswers[q.id]
          const isCorrect = userAnswer === q.correctAnswer
          const options = JSON.parse(q.options)

          return (
            <div key={q.id} className={`glass p-8 rounded-3xl border ${isCorrect ? 'border-green-500/20' : 'border-red-500/20'}`}>
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question {i + 1}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {isCorrect ? 'CORRECT' : 'INCORRECT'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-8">{q.text}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt: string) => {
                  const isUserAnswer = userAnswer === opt
                  const isCorrectAnswer = q.correctAnswer === opt

                  let style = 'bg-white/5 border-white/5 text-slate-400'
                  if (isCorrectAnswer) style = 'bg-green-500/20 border-green-500/50 text-green-400 font-bold'
                  else if (isUserAnswer && !isCorrect) style = 'bg-red-500/20 border-red-500/50 text-red-400 font-bold'

                  return (
                    <div key={opt} className={`p-4 rounded-xl border ${style}`}>
                      {opt}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
