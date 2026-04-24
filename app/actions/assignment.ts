'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAssignment(formData: FormData) {
  const session = await getSession()
  if (!session || (session.role !== 'TEACHER' && session.role !== 'ADMIN')) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const dueDate = new Date(formData.get('dueDate') as string)

  await prisma.assignment.create({
    data: {
      title,
      content,
      dueDate,
      creatorId: session.userId,
    }
  })

  revalidatePath('/teacher/assignments')
  redirect('/teacher/assignments')
}

export async function deleteAssignment(id: string) {
  const session = await getSession()
  if (!session || (session.role !== 'TEACHER' && session.role !== 'ADMIN')) {
    throw new Error('Unauthorized')
  }

  await prisma.assignment.delete({ where: { id } })
  revalidatePath('/teacher/assignments')
}
