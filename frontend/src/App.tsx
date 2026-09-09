import React, { useState } from 'react'
import { AdvisorQueue } from './components/AdvisorQueue'
import { StudentDetail } from './pages/StudentDetail'
import './App.css'

export function App() {
  const [view, setView] = useState<'queue' | 'detail'>('queue')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  const handleSelectStudent = (studentHash: string) => {
    setSelectedStudent(studentHash)
    setView('detail')
  }

  const handleBack = () => {
    setView('queue')
    setSelectedStudent(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Employability · Advisor Portal</h1>
          <div className="text-sm text-gray-600">
            Advisor · Dept of IS
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'queue' && selectedStudent === null ? (
          <AdvisorQueue onSelectStudent={handleSelectStudent} />
        ) : (
          selectedStudent && <StudentDetail studentHash={selectedStudent} onBack={handleBack} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t text-center text-xs text-gray-500">
        <p>Graduate Employability Prediction System v0.1 · Every view is logged</p>
      </footer>
    </div>
  )
}

export default App
