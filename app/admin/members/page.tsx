import { prisma } from '@/lib/prisma'
import RoleSelector from './RoleSelector'
import { resetPassword, deleteUser } from '@/app/actions/admin'
import TokenGenerator from './TokenGenerator'
import MemberActions from './MemberActions'

export default async function MembersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 text-primary font-bold tracking-tighter uppercase">DIRECTORY_CORE</h1>
          <p className="text-primary font-mono text-xs uppercase tracking-[0.3em]">Network Nodes: {users.length}</p>
        </div>
        <div className="w-64">
          <TokenGenerator />
        </div>
      </header>

      <div className="card-panel panel-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-primary text-[10px] font-black tracking-[0.2em] uppercase border-b border-white/10">
              <th className="px-8 py-4">IDENTITY</th>
              <th className="px-8 py-4">NET_ADDRESS</th>
              <th className="px-8 py-4">ACCESS_LEVEL</th>
              <th className="px-8 py-4 text-right">PROTOCOLS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-black text-white uppercase group-hover:text-primary transition-colors">{user.name}</div>
                  <div className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-1">
                    SYNCED: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 py-6 text-slate-400 font-mono text-xs">{user.email}</td>
                <td className="px-8 py-6">
                  <RoleSelector userId={user.id} currentRole={user.role} />
                </td>
                <td className="px-8 py-6 text-right flex flex-col items-end gap-2">
                  <MemberActions userId={user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
