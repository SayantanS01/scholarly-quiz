import { prisma } from '@/lib/prisma'
import RoleSelector from './RoleSelector'
import { resetPassword, deleteUser } from '@/app/actions/admin'

export default async function MembersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Member Management</h1>
          <p className="text-slate-400">Add, remove, and assign roles to platform members</p>
        </div>
      </header>

      <div className="glass overflow-hidden rounded-2xl border-0">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-sm font-semibold border-b border-white/10">
              <th className="px-8 py-4">Name</th>
              <th className="px-8 py-4">Email</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 py-6 text-slate-300 font-medium">{user.email}</td>
                <td className="px-8 py-6">
                  <RoleSelector userId={user.id} currentRole={user.role} />
                </td>
                <td className="px-8 py-6 text-right space-y-2">
                  <form action={resetPassword}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button 
                      className="text-orange-400 hover:text-orange-300 font-bold text-xs px-3 py-1 rounded bg-orange-500/10 hover:bg-orange-500/20 transition-all w-32"
                      onClick={(e) => {
                        // @ts-ignore
                        if (!confirm('Reset password to "reset123"?')) e.preventDefault()
                      }}
                    >
                      RESET PASS
                    </button>
                  </form>
                  <form action={deleteUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button 
                      className="text-red-400 hover:text-red-300 font-bold text-xs px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-all w-32"
                      onClick={(e) => {
                        // @ts-ignore
                        if (!confirm('Are you sure you want to delete this user?')) e.preventDefault()
                      }}
                    >
                      REMOVE
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
