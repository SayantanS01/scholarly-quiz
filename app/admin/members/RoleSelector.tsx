'use client'

import { updateRole } from '@/app/actions/admin'

export default function RoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
  return (
    <select 
      name="role"
      defaultValue={currentRole}
      onChange={async (e) => {
        const formData = new FormData()
        formData.append('userId', userId)
        formData.append('role', e.target.value)
        await updateRole(formData)
      }}
      className="bg-black border border-primary text-white text-xs font-mono rounded-none px-3 py-2 outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all cursor-pointer"
    >
      <option value="STUDENT">Student</option>
      <option value="TEACHER">Teacher</option>
      <option value="ADMIN">Admin</option>
    </select>
  )
}
