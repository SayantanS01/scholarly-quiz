'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/session'

export async function generateTeacherToken() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') throw new Error('Unauthorized')

  const token = Math.random().toString(36).substring(2, 8).toUpperCase()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.teacherToken.create({
    data: {
      token,
      expiresAt,
    }
  })

  revalidatePath('/admin/members')
  return token
}

export async function updateRole(formData: FormData) {
  const userId = formData.get('userId') as string
  const role = formData.get('role') as any
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })
  revalidatePath('/admin/members')
}

export async function resetPassword(formData: FormData) {
  const userId = formData.get('userId') as string
  const newPassword = await bcrypt.hash("reset123", 10)
  await prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  })
  revalidatePath('/admin/members')
}

export async function deleteUser(formData: FormData) {
  const userId = formData.get('userId') as string
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath('/admin/members')
}
