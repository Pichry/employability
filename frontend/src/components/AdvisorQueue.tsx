import React, { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import type { Queue } from '../types'
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

interface AdvisorQueueProps {
  onSelectStudent: (studentHash: string) => void
}

const MOCK_QUEUE: Queue = {
  advisor_id: 'advisor_001',
  date: new Date().toISOString().split('T')[0],
  high_risk: 3,
  medium_risk: 8,
  low_risk: 42,
  total: 53,
  students: [
    { student_hash: 'h1', name: 'Alex Chen', risk_segment: 'HIGH', probability: 0.78, due_at: '2026-09-12' },
    { student_hash: 'h2', name: 'Jordan Smith', risk_segment: 'HIGH', probability: 0.72, due_at: '2026-09-11' },
    { student_hash: 'h3', name: 'Taylor Morgan', risk_segment: 'HIGH', probability: 0.65, due_at: '2026-09-13' },
    { student_hash: 'm1', name: 'Casey Rodriguez', risk_segment: 'MEDIUM', probability: 0.54, due_at: '2026-09-15' },
    { student_hash: 'm2', name: 'Riley Johnson', risk_segment: 'MEDIUM', probability: 0.51, due_at: '2026-09-14' },
    { student_hash: 'm3', name: 'Morgan Lee', risk_segment: 'MEDIUM', probability: 0.48, due_at: '2026-09-16' },
    { student_hash: 'm4', name: 'Parker Williams', risk_segment: 'MEDIUM', probability: 0.46, due_at: '2026-09-17' },
    { student_hash: 'm5', name: 'Quinn Davis', risk_segment: 'MEDIUM', probability: 0.45, due_at: '2026-09-18' },
    { student_hash: 'm6', name: 'Skyler Brown', risk_segment: 'MEDIUM', probability: 0.42, due_at: '2026-09-19' },
    { student_hash: 'm7', name: 'River Martinez', risk_segment: 'MEDIUM', probability: 0.40, due_at: '2026-09-20' },
    { student_hash: 'm8', name: 'Avery Thompson', risk_segment: 'MEDIUM', probability: 0.38, due_at: '2026-09-21' },
    { student_hash: 'l1', name: 'Blake Anderson', risk_segment: 'LOW', probability: 0.15, due_at: null },
    { student_hash: 'l2', name: 'Drew Taylor', risk_segment: 'LOW', probability: 0.12, due_at: null },
    { student_hash: 'l3', name: 'Sam Harris', risk_segment: 'LOW', probability: 0.10, due_at: null },
  ]
}

export function AdvisorQueue({ onSelectStudent }: AdvisorQueueProps) {
  const [queue, setQueue] = useState<Queue>(MOCK_QUEUE)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [usingMockData, setUsingMockData] = useState(true)

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const data = await apiClient.getMyQueue()
        setQueue(data)
        setUsingMockData(false)
      } catch (error) {
        console.log('Using fallback mock data (Phase 0 - Backend Phase 6 not yet built)')
      }
    }
    loadQueue()
  }, [])

  if (loading) return <div className="p-4 text-center">Loading queue...</div>

  const filtered = queue.students.filter(s => {
    if (filter === 'all') return true
    return s.risk_segment.toLowerCase() === filter
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600">HIGH RISK</p>
          <p className="text-2xl font-bold text-red-600">{queue.high_risk}</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-gray-600">MEDIUM RISK</p>
          <p className="text-2xl font-bold text-amber-600">{queue.medium_risk}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">LOW RISK</p>
          <p className="text-2xl font-bold text-green-600">{queue.low_risk}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">TOTAL</p>
          <p className="text-2xl font-bold text-blue-600">{queue.total}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'high', 'medium', 'low'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-sm font-medium ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((student) => {
          const Icon = student.risk_segment === 'HIGH' ? AlertTriangle : student.risk_segment === 'MEDIUM' ? AlertCircle : CheckCircle
          const color = student.risk_segment === 'HIGH' ? 'border-red-300' : student.risk_segment === 'MEDIUM' ? 'border-amber-300' : 'border-green-300'

          return (
            <div
              key={student.student_hash}
              onClick={() => onSelectStudent(student.student_hash)}
              className={`p-4 border-l-4 ${color} bg-white rounded cursor-pointer hover:shadow-md transition`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-gray-600">{student.risk_segment} RISK</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{Math.round(student.probability * 100)}%</p>
                  {student.due_at && <p className="text-xs text-gray-600">Due: {new Date(student.due_at).toLocaleDateString()}</p>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {usingMockData && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          📋 Using mock data (Phase 0) — Backend API not yet available (Phase 6)
        </div>
      )}
    </div>
  )
}
