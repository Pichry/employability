import React, { useState } from 'react'
import type { StudentDetail as StudentDetailType } from '../types'
import { RiskGauge } from '../components/RiskGauge'
import { RiskDrivers } from '../components/RiskDrivers'
import { WhatIfSimulator } from '../components/WhatIfSimulator'

interface StudentDetailProps {
  studentHash: string
  onBack: () => void
}

const STUDENT_DETAILS: Record<string, StudentDetailType> = {
  h1: {
    student: { name: 'Alex Chen', student_hash: 'h1', program_id: 'CS-BS', cohort_year: 2023, credits_earned: 92, credits_attempted: 96 },
    prediction: { id: 1, student_hash: 'h1', probability: 0.78, ci_low: 0.71, ci_high: 0.84, risk_segment: 'HIGH', model_version_id: '1.2.0', created_at: '2026-09-09' },
    drivers: [
      { feature_name: 'Low GPA (3.1)', direction: 'negative', shap_value: 0.24, rank: 1, modifiable: true },
      { feature_name: 'No internship', direction: 'negative', shap_value: 0.19, rank: 2, modifiable: true },
      { feature_name: 'Limited clubs', direction: 'negative', shap_value: 0.15, rank: 3, modifiable: true },
      { feature_name: 'First gen student', direction: 'negative', shap_value: 0.12, rank: 4, modifiable: false },
      { feature_name: 'CS major', direction: 'negative', shap_value: 0.08, rank: 5, modifiable: false }
    ],
    case: { id: 1, student_hash: 'h1', prediction_id: 1, assigned_to: 'adv1', opened_at: '2026-09-01', due_at: '2026-09-12', status: 'open', priority: 1 },
    actions: [],
    notes: []
  },
  h2: {
    student: { name: 'Jordan Smith', student_hash: 'h2', program_id: 'BUSN-BS', cohort_year: 2023, credits_earned: 88, credits_attempted: 96 },
    prediction: { id: 2, student_hash: 'h2', probability: 0.72, ci_low: 0.64, ci_high: 0.80, risk_segment: 'HIGH', model_version_id: '1.2.0', created_at: '2026-09-09' },
    drivers: [
      { feature_name: 'Declining GPA', direction: 'negative', shap_value: 0.28, rank: 1, modifiable: false },
      { feature_name: 'Job search inactive', direction: 'negative', shap_value: 0.20, rank: 2, modifiable: true },
      { feature_name: 'No internship', direction: 'negative', shap_value: 0.16, rank: 3, modifiable: true },
      { feature_name: 'Low engagement', direction: 'negative', shap_value: 0.10, rank: 4, modifiable: true },
      { feature_name: 'Business major', direction: 'negative', shap_value: 0.05, rank: 5, modifiable: false }
    ],
    case: { id: 2, student_hash: 'h2', prediction_id: 2, assigned_to: 'adv1', opened_at: '2026-09-02', due_at: '2026-09-11', status: 'open', priority: 1 },
    actions: [],
    notes: []
  },
  h3: {
    student: { name: 'Taylor Morgan', student_hash: 'h3', program_id: 'ENG-BS', cohort_year: 2023, credits_earned: 90, credits_attempted: 96 },
    prediction: { id: 3, student_hash: 'h3', probability: 0.65, ci_low: 0.56, ci_high: 0.73, risk_segment: 'HIGH', model_version_id: '1.2.0', created_at: '2026-09-09' },
    drivers: [
      { feature_name: 'Limited networking', direction: 'negative', shap_value: 0.22, rank: 1, modifiable: true },
      { feature_name: 'GPA 3.3', direction: 'negative', shap_value: 0.17, rank: 2, modifiable: true },
      { feature_name: 'No summer internship', direction: 'negative', shap_value: 0.15, rank: 3, modifiable: true },
      { feature_name: 'Rural background', direction: 'negative', shap_value: 0.11, rank: 4, modifiable: false },
      { feature_name: 'Engineering major', direction: 'negative', shap_value: 0.08, rank: 5, modifiable: false }
    ],
    case: { id: 3, student_hash: 'h3', prediction_id: 3, assigned_to: 'adv1', opened_at: '2026-09-03', due_at: '2026-09-13', status: 'open', priority: 1 },
    actions: [],
    notes: []
  },
  m1: {
    student: { name: 'Casey Rodriguez', student_hash: 'm1', program_id: 'MIS-BS', cohort_year: 2023, credits_earned: 86, credits_attempted: 96 },
    prediction: { id: 4, student_hash: 'm1', probability: 0.54, ci_low: 0.45, ci_high: 0.63, risk_segment: 'MEDIUM', model_version_id: '1.2.0', created_at: '2026-09-09' },
    drivers: [
      { feature_name: 'GPA 3.4', direction: 'positive', shap_value: -0.12, rank: 1, modifiable: true },
      { feature_name: 'One internship', direction: 'positive', shap_value: -0.10, rank: 2, modifiable: true },
      { feature_name: 'Moderate clubs', direction: 'positive', shap_value: -0.08, rank: 3, modifiable: true },
      { feature_name: 'MIS major', direction: 'positive', shap_value: -0.06, rank: 4, modifiable: false },
      { feature_name: 'Urban background', direction: 'positive', shap_value: -0.05, rank: 5, modifiable: false }
    ],
    case: { id: 4, student_hash: 'm1', prediction_id: 4, assigned_to: 'adv1', opened_at: '2026-09-04', due_at: '2026-09-15', status: 'open', priority: 2 },
    actions: [],
    notes: []
  },
  l1: {
    student: { name: 'Blake Anderson', student_hash: 'l1', program_id: 'CS-BS', cohort_year: 2023, credits_earned: 94, credits_attempted: 96 },
    prediction: { id: 5, student_hash: 'l1', probability: 0.15, ci_low: 0.08, ci_high: 0.25, risk_segment: 'LOW', model_version_id: '1.2.0', created_at: '2026-09-09' },
    drivers: [
      { feature_name: 'Strong GPA 3.8', direction: 'positive', shap_value: -0.30, rank: 1, modifiable: false },
      { feature_name: 'Two internships', direction: 'positive', shap_value: -0.20, rank: 2, modifiable: false },
      { feature_name: 'Active in clubs', direction: 'positive', shap_value: -0.15, rank: 3, modifiable: false },
      { feature_name: 'Job offer in hand', direction: 'positive', shap_value: -0.12, rank: 4, modifiable: false },
      { feature_name: 'CS major (high demand)', direction: 'positive', shap_value: -0.08, rank: 5, modifiable: false }
    ],
    case: null,
    actions: [],
    notes: []
  }
}

export function StudentDetail({ studentHash, onBack }: StudentDetailProps) {
  const [caseNote, setCaseNote] = useState('')
  const detail = STUDENT_DETAILS[studentHash] || STUDENT_DETAILS.h1

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
