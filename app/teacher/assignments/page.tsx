import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { createAssignment, deleteAssignment } from '@/app/actions/assignment'

export default async function TeacherAssignmentsPage() {
  const session = await getSession()
  const assignments = await prisma.assignment.findMany({
    where: { creatorId: session?.userId },
    orderBy: { dueDate: 'asc' }
  })

  async function handleDelete(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await deleteAssignment(id)
  }

  return (
    <div>
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 text-primary font-bold tracking-tighter">ASSIGNMENT_CONTROL</h1>
          <p className="text-primary font-mono text-xs uppercase tracking-[0.3em]">Active Tasks: {assignments.length}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Create Assignment Form */}
        <div className="lg:col-span-1">
          <div className="card-panel p-8 panel-border border-primary">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">NEW_TASK_ENTRY</h3>
            <form action={createAssignment} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-primary mb-2 uppercase tracking-widest">TASK_TITLE</label>
                <input name="title" required className="w-full bg-black border border-slate-800 p-4 text-white font-mono text-sm focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-primary mb-2 uppercase tracking-widest">CONTENT_BODY</label>
                <textarea name="content" required className="w-full bg-black border border-slate-800 p-4 text-white font-mono text-sm focus:border-primary outline-none h-32" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-primary mb-2 uppercase tracking-widest">EXPIRATION_DATE</label>
                <input name="dueDate" type="date" required className="w-full bg-black border border-slate-800 p-4 text-white font-mono text-sm focus:border-primary outline-none" />
              </div>
              <button type="submit" className="btn-primary border-primary text-primary hover:bg-primary/10 w-full">
                [ DEPLOY_TASK ]
              </button>
            </form>
          </div>
        </div>

        {/* Assignments List */}
        <div className="lg:col-span-2 space-y-6">
          {assignments.map((task: any) => (
            <div key={task.id} className="card-panel p-8 panel-border border-white/10 group hover:border-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-black text-white uppercase group-hover:text-primary transition-colors">{task.title}</h4>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={task.id} />
                  <button className="text-red-500 font-black text-[10px] hover:text-white">[ PURGE ]</button>
                </form>
              </div>
              <p className="text-slate-500 font-mono text-sm mb-6 leading-relaxed">{task.content}</p>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-700">
                <span className="text-primary">DUE:</span> {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
          ))}
          {assignments.length === 0 && (
            <div className="text-center py-20 border border-dashed border-slate-800 text-slate-700 font-mono text-xs uppercase tracking-widest">
              NO_ASSIGNMENTS_IN_BUFFER
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
