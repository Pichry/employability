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

const MOCK_DETAILS: Record<string, StudentDetailType> = {
  h1: {
    student: { name: 'Alex Chen', student_hash: 'h1', program_id: 'CS-BS', credits_earned: 92, credits_attempted: 96 },
    prediction: { probability: 0.78, ci_low: 0.71, ci_high: 0.84, risk_segment: 'HIGH', model_version: '1.2.0', prediction_date: '2026-09-09' },
    drivers: [
      { feature: 'Low GPA (3.1)', direction: 'negative', shap_value: 0.24, modifiable: true },
      { feature: 'No internship', direction: 'negative', shap_value: 0.19, modifiable: true },
      { feature: 'Limited clubs', direction: 'negative', shap_value: 0.15, modifiable: true },
      { feature: 'First gen student', direction: 'negative', shap_value: 0.12, modifiable: false },
      { feature: 'CS major', direction: 'negative', shap_value: 0.08, modifiable: false }
    ],
    case: { case_id: 1, advisor_id: 'adv1', open_date: '2026-09-01', status: 'active', actions: [] }
  },
  h2: {
    student: { name: 'Jordan Smith', student_hash: 'h2', program_id: 'BUSN-BS', credits_earned: 88, credits_attempted: 96 },
    prediction: { probability: 0.72, ci_low: 0.64, ci_high: 0.80, risk_segment: 'HIGH', model_version: '1.2.0', prediction_date: '2026-09-09' },
    drivers: [
      { feature: 'Declining GPA', direction: 'negative', shap_value: 0.28, modifiable: false },
      { feature: 'Job search inactive', direction: 'negative', shap_value: 0.20, modifiable: true },
      { feature: 'No internship', direction: 'negative', shap_value: 0.16, modifiable: true },
      { feature: 'Low engagement', direction: 'negative', shap_value: 0.10, modifiable: true },
      { feature: 'Business major', direction: 'negative', shap_value: 0.05, modifiable: false }
    ],
    case: { case_id: 2, advisor_id: 'adv1', open_date: '2026-09-02', status: 'active', actions: [] }
  },
  h3: {
    student: { name: 'Taylor Morgan', student_hash: 'h3', program_id: 'ENG-BS', credits_earned: 90, credits_attempted: 96 },
    prediction: { probability: 0.65, ci_low: 0.56, ci_high: 0.73, risk_segment: 'HIGH', model_version: '1.2.0', prediction_date: '2026-09-09' },
    drivers: [
      { feature: 'Limited networking', direction: 'negative', shap_value: 0.22, modifiable: true },
      { feature: 'GPA 3.3', direction: 'negative', shap_value: 0.17, modifiable: true },
      { feature: 'No summer internship', direction: 'negative', shap_value: 0.15, modifiable: true },
      { feature: 'Rural background', direction: 'negative', shap_value: 0.11, modifiable: false },
      { feature: 'Engineering major', direction: 'positive', shap_value: -0.08, modifiable: false }
    ],
    case: { case_id: 3, advisor_id: 'adv1', open_date: '2026-09-03', status: 'active', actions: [] }
  },
  m1: {
    student: { name: 'Casey Rodriguez', student_hash: 'm1', program_id: 'MIS-BS', credits_earned: 86, credits_attempted: 96 },
    prediction: { probability: 0.54, ci_low: 0.45, ci_high: 0.63, risk_segment: 'MEDIUM', model_version: '1.2.0', prediction_date: '2026-09-09' },
    drivers: [
      { feature: 'GPA 3.4', direction: 'positive', shap_value: -0.12, modifiable: true },
      { feature: 'One internship', direction: 'positive', shap_value: -0.10, modifiable: true },
      { feature: 'Moderate clubs', direction: 'neutral', shap_value: 0.08, modifiable: true },
      { feature: 'MIS major', direction: 'positive', shap_value: -0.06, modifiable: false },
      { feature: 'Urban background', direction: 'positive', shap_value: -0.05, modifiable: false }
    ],
    case: { case_id: 4, advisor_id: 'adv1', open_date: '2026-09-04', status: 'active', actions: [] }
  },
  l1: {
    student: { name: 'Blake Anderson', student_hash: 'l1', program_id: 'CS-BS', credits_earned: 94, credits_attempted: 96 },
    prediction: { probability: 0.15, ci_low: 0.08, ci_high: 0.25, risk_segment: 'LOW', model_version: '1.2.0', prediction_date: '2026-09-09' },
    drivers: [
      { feature: 'Strong GPA 3.8', direction: 'positive', shap_value: -0.30, modifiable: false },
      { feature: 'Two internships', direction: 'positive', shap_value: -0.20, modifiable: false },
      { feature: 'Active in clubs', direction: 'positive', shap_value: -0.15, modifiable: false },
      { feature: 'Job offer in hand', direction: 'positive', shap_value: -0.12, modifiable: false },
      { feature: 'CS major (high demand)', direction: 'positive', shap_value: -0.08, modifiable: false }
    ],
    case: { case_id: 5, advisor_id: 'adv1', open_date: '2026-09-05', status: 'closed', actions: [] }
  }
}

export function StudentDetail({ studentHash, onBack }: StudentDetailProps) {
  const [detail, setDetail] = useState<StudentDetailType>(MOCK_DETAILS[studentHash] || MOCK_DETAILS.h1)
  const [loading, setLoading] = useState(false)
  const [caseNote, setCaseNote] = useState('')
  const [usingMockData, setUsingMockData] = useState(true)

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await apiClient.getStudentDetail(studentHash)
        setDetail(data)
        setUsingMockData(false)
      } catch (error) {
        console.log('Using fallback mock data (Phase 0 - Backend Phase 6 not yet built)')
      }
    }
    loadDetail()
  }, [studentHash])

  if (loading) return <div className="p-8 text-center">Loading...</div>

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

      {usingMockData && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          📋 Using mock data (Phase 0) — Backend API not yet available (Phase 6)
        </div>
      )}
    </div>
  )
}
