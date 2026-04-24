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
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2 text-primary font-bold tracking-tighter uppercase">{quiz.title}</h1>
        <p className="text-primary font-mono text-xs uppercase tracking-[0.3em]">INSTRUCTOR: {quiz.creator.name.toUpperCase()}</p>
      </header>

      <QuizSession quiz={quiz} userId={session?.userId as string} />
    </div>
  )
}
