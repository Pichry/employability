import React, { useEffect, useState } from 'react'
import { apiClient } from '../api/client'
import type { Queue } from '../types'
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

interface AdvisorQueueProps {
  onSelectStudent: (studentHash: string) => void
}

export function AdvisorQueue({ onSelectStudent }: AdvisorQueueProps) {
  const [queue, setQueue] = useState<Queue | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const data = await apiClient.getMyQueue()
        setQueue(data)
      } catch (error) {
        console.error('Failed to load queue:', error)
      } finally {
        setLoading(false)
      }
    }
    loadQueue()
  }, [])

  if (loading) return <div className="p-4 text-center">Loading queue...</div>
  if (!queue) return <div className="p-4 text-center text-red-600">Failed to load queue</div>

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
    </div>
  )
}
