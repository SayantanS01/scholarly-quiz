'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitAttempt } from '@/app/actions/quiz'

export default function QuizSession({ quiz, userId }: { quiz: any, userId: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const question = quiz.questions[currentQuestion]
  const options = JSON.parse(question.options)

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [question.id]: option })
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const finishQuiz = async () => {
    setLoading(true)
    try {
      await submitAttempt({
        quizId: quiz.id,
        userId,
        answers
      })
      router.push('/student/results')
    } catch (error) {
      console.error(error)
      alert('Failed to submit quiz')
    } finally {
      setLoading(false)
    }
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="space-y-12">
      {/* Progress Bar */}
      <div className="w-full bg-black h-1 border border-white/5 relative">
        <div 
          className="bg-neon-cyan h-full transition-all duration-500 shadow-[0_0_15px_var(--neon-cyan)]" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute top-4 right-0 text-[10px] font-black text-primary tracking-[0.3em]">
          SYNC_PROGRESS: {Math.round(progress)}%
        </div>
      </div>

      <div className="card-panel p-12 panel-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-20"></div>
        
        <div className="flex justify-between items-center mb-10">
          <span className="text-[10px] font-black tracking-[0.3em] text-slate-600 uppercase">
            DATA_SEGMENT_{currentQuestion + 1} // TOTAL_{quiz.questions.length}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-12 leading-tight tracking-tighter">
          {question.text}
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className={`text-left p-6 border transition-all duration-300 font-mono text-sm tracking-widest ${
                answers[question.id] === opt 
                  ? 'bg-neon-cyan border-primary text-black font-black scale-[1.01] shadow-[0_0_20px_rgba(0,255,255,0.3)]' 
                  : 'bg-card/50 border-white/10 text-slate-400 hover:border-primary hover:text-white'
              }`}
            >
              <span className="inline-block w-6 h-6 border border-current text-center leading-6 mr-6 text-[10px] font-black">
                {String.fromCharCode(65 + i)}
              </span>
              {opt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-10 py-3 border border-slate-800 text-slate-500 font-black text-xs tracking-widest disabled:opacity-10 transition-all hover:border-white hover:text-white"
        >
          [ PREV_SEGMENT ]
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={finishQuiz}
            disabled={loading || Object.keys(answers).length < quiz.questions.length}
            className="btn-primary px-16 py-4 text-sm"
          >
            {loading ? '[ UPLOADING... ]' : '[ FINALIZE_SYNC ]'}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={!answers[question.id]}
            className="px-12 py-3 border border-primary text-primary font-black text-xs tracking-widest hover:bg-primary/10 hover:text-black transition-all disabled:opacity-20"
          >
            [ NEXT_SEGMENT ]
          </button>
        )}
      </div>
    </div>
  )
}
