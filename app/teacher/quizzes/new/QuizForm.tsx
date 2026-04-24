'use client'

import { useState } from 'react'
import { createQuiz } from '@/app/actions/quiz'

export default function QuizForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswer: '' }
  ])
  const [loading, setLoading] = useState(false)

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: '' }])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions]
    // @ts-ignore
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options[oIndex] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createQuiz({ title, description, category, questions })
    } catch (error) {
      console.error(error)
      alert('Failed to create quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl">
      <div className="glass-panel p-8 cyber-border border-neon-magenta/30 space-y-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter neon-text-magenta">MODULE_CONFIG</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-black text-neon-magenta mb-2 uppercase tracking-widest">MODULE_TITLE</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-slate-800 p-4 text-white font-mono text-sm focus:border-neon-magenta outline-none transition-all"
              placeholder="e.g. NEURAL_SYNC_PROTOCOL"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-neon-magenta mb-2 uppercase tracking-widest">CLASSIFICATION</label>
            <input 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black border border-slate-800 p-4 text-white font-mono text-sm focus:border-neon-magenta outline-none transition-all"
              placeholder="e.g. CYBERNETICS"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-neon-magenta mb-2 uppercase tracking-widest">SPECIFICATION_DATA</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-black border border-slate-800 p-4 text-white font-mono text-sm focus:border-neon-magenta outline-none h-32 transition-all"
            placeholder="Technical details for the synchronized unit..."
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">DATA_SEGMENTS</h3>
          <button 
            type="button" 
            onClick={addQuestion}
            className="px-6 py-2 border border-neon-magenta text-neon-magenta font-black text-[10px] tracking-widest hover:bg-neon-magenta hover:text-black transition-all"
          >
            [ ADD_SEGMENT ]
          </button>
        </div>

        {questions.map((q: any, qIndex: number) => (
          <div key={qIndex} className="glass-panel p-10 cyber-border border-white/5 space-y-8 relative group hover:border-neon-magenta/40 transition-all">
            <button 
              type="button" 
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-6 right-6 text-red-500 font-black text-[10px] opacity-30 group-hover:opacity-100 transition-opacity uppercase tracking-widest"
            >
              [ PURGE ]
            </button>
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">SEGMENT_ID_{qIndex + 1}</label>
              <input 
                value={q.text} 
                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-sm focus:border-neon-magenta outline-none transition-all"
                placeholder="Enter query string..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {q.options.map((opt: string, oIndex: number) => (
                <div key={oIndex} className="flex items-center gap-4 group/opt">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input 
                      type="radio" 
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === opt && opt !== ''}
                      onChange={() => updateQuestion(qIndex, 'correctAnswer', opt)}
                      className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className={`w-4 h-4 border-2 transition-all ${q.correctAnswer === opt ? 'bg-neon-magenta border-neon-magenta scale-110 shadow-[0_0_10px_var(--neon-magenta)]' : 'border-slate-700 bg-transparent'}`}></div>
                  </div>
                  <input 
                    value={opt} 
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 p-4 text-white font-mono text-xs focus:border-neon-magenta outline-none transition-all"
                    placeholder={`DATA_POINT_${oIndex + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
            <p className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">Select the radio node corresponding to the correct Boolean outcome.</p>
          </div>
        ))}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="btn-cyber border-neon-magenta text-neon-magenta hover:bg-neon-magenta w-full py-6 text-sm"
      >
        {loading ? '[ UPLOADING_MODULE... ]' : '[ DEPLOY_SYNC_MODULE ]'}
      </button>
    </form>
  )
}
