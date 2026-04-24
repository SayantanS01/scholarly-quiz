import { prisma } from '@/lib/prisma'

export default async function StudentAssignmentsPage() {
  const assignments = await prisma.assignment.findMany({
    orderBy: { dueDate: 'asc' },
    include: { creator: { select: { name: true } } }
  })

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2 text-primary font-bold tracking-tighter">TASK_QUEUE</h1>
        <p className="text-primary font-mono text-xs uppercase tracking-[0.3em]">Pending Obligations: {assignments.length}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assignments.map((task: any) => (
          <div key={task.id} className="card-panel p-8 panel-border group hover:border-primary transition-all">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-2xl font-black text-white uppercase group-hover:text-primary font-bold transition-all">{task.title}</h4>
              <div className="text-[9px] font-black text-primary border border-primary px-2 py-1 tracking-widest">
                INSTRUCTOR: {task.creator.name.toUpperCase()}
              </div>
            </div>
            <p className="text-slate-500 font-mono text-xs mb-8 leading-relaxed group-hover:text-slate-400 transition-colors">{task.content}</p>
            <div className="flex justify-between items-center border-t border-white/5 pt-6">
              <div className="text-[10px] font-black text-slate-700">
                <span className="text-primary">DEADLINE:</span> {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <button className="text-[10px] font-black text-primary border border-primary px-4 py-2 hover:bg-primary/10 hover:text-black transition-all">
                [ SUBMIT_PROPOSAL ]
              </button>
            </div>
          </div>
        ))}
        {assignments.length === 0 && (
          <div className="col-span-full py-32 text-center card-panel panel-border text-slate-700 font-mono text-xs uppercase tracking-widest">
            NO_TASKS_IN_QUEUE
          </div>
        )}
      </div>
    </div>
  )
}
