import QuizForm from './QuizForm'

export default function NewQuizPage() {
  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Create New Quiz</h1>
        <p className="text-slate-400">Design your assessment and set the challenges</p>
      </header>

      <QuizForm />
    </div>
  )
}
