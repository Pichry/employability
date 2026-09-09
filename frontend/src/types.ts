/**
 * Type definitions for the Employability Prediction System
 * These correspond to the database schema (db/schema/01_initial_schema.sql)
 */

export interface Student {
  student_hash: string
  name: string
  program_id: string
  cohort_year: number
  credits_earned: number
  credits_attempted: number
}

export interface RiskPrediction {
  id: number
  student_hash: string
  probability: number
  ci_low: number
  ci_high: number
  risk_segment: 'HIGH' | 'MEDIUM' | 'LOW'
  created_at: string
  model_version_id: string
}

export interface RiskDriver {
  feature_name: string
  shap_value: number
  direction: 'positive' | 'negative'
  rank: number
  modifiable: boolean
}

export interface InterventionCase {
  id: number
  student_hash: string
  prediction_id: number
  assigned_to: string
  status: 'new' | 'open' | 'in_progress' | 'closed'
  opened_at: string
  due_at: string | null
  priority: number
}

export interface InterventionAction {
  id: number
  case_id: number
  intervention_type_id: string
  status: 'assigned' | 'in_progress' | 'completed' | 'declined'
  delivered_at: string | null
  attended: boolean
}

export interface CaseNote {
  id: number
  case_id: number
  author_id: string
  body: string
  created_at: string
}

export interface StudentDetail {
  student: Student
  prediction: RiskPrediction
  drivers: RiskDriver[]
  case: InterventionCase | null
  actions: InterventionAction[]
  notes: CaseNote[]
}

export interface User {
  id: number
  email: string
  role: 'advisor' | 'head' | 'placement' | 'analyst' | 'qa_ethics' | 'admin'
  scope_type: 'faculty' | 'department' | 'program' | null
  scope_id: string | null
}

export interface WhatIfScenario {
  baseline_probability: number
  modified_features: Record<string, boolean | number | string>
  new_probability: number
  delta: number
}

export interface Queue {
  total: number
  high_risk: number
  medium_risk: number
  low_risk: number
  students: Array<{
    student_hash: string
    name: string
    probability: number
    risk_segment: string
    due_at: string | null
  }>
}
