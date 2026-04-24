'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'TEACHER']).default('STUDENT'),
})

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
})

export async function signup(prevState: any, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { name, email, password, role } = validatedFields.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return { message: 'Email already in use' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  })

  await createSession(user.id, user.role)
  redirect(role === 'TEACHER' ? '/teacher' : '/student')
}

export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { email, password } = validatedFields.data

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { message: 'Invalid email or password' }
  }

  await createSession(user.id, user.role)

  const redirectPathMap = {
    ADMIN: '/admin',
    TEACHER: '/teacher',
    STUDENT: '/student',
  }
  const role = user.role as keyof typeof redirectPathMap

  redirect(redirectPathMap[role])
}

export async function logout() {
  await deleteSession()
  redirect('/')
}
