'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const QuizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  questions: z.array(z.object({
    text: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()).min(2, 'At least 2 options are required'),
    correctAnswer: z.string().min(1, 'Correct answer is required'),
  })).min(1, 'At least one question is required'),
})

export async function createQuiz(data: any) {
  const session = await getSession()
  if (!session || (session.role !== 'TEACHER' && session.role !== 'ADMIN')) {
    throw new Error('Unauthorized')
  }

  const validated = QuizSchema.parse(data)

  const quiz = await prisma.quiz.create({
    data: {
      title: validated.title,
      description: validated.description,
      category: validated.category,
      creatorId: session.userId,
      questions: {
        create: validated.questions.map(q => ({
          text: q.text,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
        }))
      }
    }
  })

  revalidatePath('/teacher/quizzes')
  redirect('/teacher/quizzes')
}

export async function deleteQuiz(quizId: string) {
  const session = await getSession()
  if (!session || (session.role !== 'TEACHER' && session.role !== 'ADMIN')) {
    throw new Error('Unauthorized')
  }

  await prisma.quiz.delete({
    where: { id: quizId, creatorId: session.userId } // Ensure they own it or are admin
  })

  revalidatePath('/teacher/quizzes')
}

export async function submitAttempt({ quizId, userId, answers }: { quizId: string, userId: string, answers: Record<string, string> }) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true }
  })

  if (!quiz) throw new Error('Quiz not found')

  let correctCount = 0
  quiz.questions.forEach(q => {
    if (answers[q.id] === q.correctAnswer) {
      correctCount++
    }
  })

  const score = (correctCount / quiz.questions.length) * 100

  await prisma.attempt.create({
    data: {
      quizId,
      studentId: userId,
      score,
      answers: JSON.stringify(answers),
      status: 'COMPLETED',
      completedAt: new Date()
    }
  })

  revalidatePath('/student/results')
  revalidatePath('/student')
}
