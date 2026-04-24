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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="glass p-8 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">General Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Quiz Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-primary"
              placeholder="e.g. Intro to Quantum Physics"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
            <input 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-primary"
              placeholder="e.g. Science"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-primary h-24"
            placeholder="What should students know before starting?"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Questions</h3>
          <button 
            type="button" 
            onClick={addQuestion}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
          >
            + ADD QUESTION
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="glass p-8 rounded-2xl space-y-6 relative group">
            <button 
              type="button" 
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove
            </button>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Question {qIndex + 1}</label>
              <input 
                value={q.text} 
                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-primary"
                placeholder="Enter the question text"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswer === opt && opt !== ''}
                    onChange={() => updateQuestion(qIndex, 'correctAnswer', opt)}
                    required
                  />
                  <input 
                    value={opt} 
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-primary text-sm"
                    placeholder={`Option ${oIndex + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 italic">Select the radio button next to the correct answer.</p>
          </div>
        ))}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="btn-premium w-full text-xl py-4"
      >
        {loading ? 'PUBLISHING...' : 'PUBLISH QUIZ'}
      </button>
    </form>
  )
}
