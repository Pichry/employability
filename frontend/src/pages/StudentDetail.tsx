import React, { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import type { StudentDetail as StudentDetailType } from '../types'
import { RiskGauge } from '../components/RiskGauge'
import { RiskDrivers } from '../components/RiskDrivers'
import { WhatIfSimulator } from '../components/WhatIfSimulator'

interface StudentDetailProps {
  studentHash: string
  onBack: () => void
}

export function StudentDetail({ studentHash, onBack }: StudentDetailProps) {
  const [detail, setDetail] = useState<StudentDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [caseNote, setCaseNote] = useState('')

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await apiClient.getStudentDetail(studentHash)
        setDetail(data)
      } catch (error) {
        console.error('Failed to load student detail:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDetail()
  }, [studentHash])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!detail) return <div className="p-8 text-center text-red-600">Failed to load student</div>

  const { student, prediction, drivers, case: caseData } = detail

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">← Back to queue</button>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="text-gray-600 mt-1">{student.program_id} · Year 3 · {student.credits_earned}/{student.credits_attempted} credits</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <RiskGauge
            probability={prediction.probability}
            ci_low={prediction.ci_low}
            ci_high={prediction.ci_high}
            risk_segment={prediction.risk_segment}
          />
        </div>
        <div>
          <WhatIfSimulator studentHash={studentHash} currentProbability={prediction.probability} />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <RiskDrivers drivers={drivers} />
      </div>

      <div className="bg-white border rounded-lg p-6">
        <p className="text-sm text-gray-600 uppercase tracking-wide mb-4">CASE LOG</p>
        <textarea
          value={caseNote}
          onChange={(e) => setCaseNote(e.target.value)}
          placeholder="Log what you discussed..."
          className="w-full p-3 border rounded mb-2 text-sm"
          rows={3}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium">
          Log Contact
        </button>
      </div>
    </div>
  )
}
