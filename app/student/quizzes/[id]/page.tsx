import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import QuizSession from './QuizSession'
import { notFound } from 'next/navigation'

export default async function QuizPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const session = await getSession()
  
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: true,
      creator: { select: { name: true } }
    }
  })

  if (!quiz) notFound()

  return (
    <div className="max-w-4xl mx-auto py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-white mb-2">{quiz.title}</h1>
        <p className="text-slate-400">Quiz by {quiz.creator.name}</p>
      </header>

      <QuizSession quiz={quiz} userId={session?.userId} />
    </div>
  )
}
