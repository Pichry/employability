import React, { useState } from 'react'
import { apiClient } from '../api/client'

interface WhatIfSimulatorProps {
  studentHash: string
  currentProbability: number
}

export function WhatIfSimulator({ studentHash, currentProbability }: WhatIfSimulatorProps) {
  const [modifications, setModifications] = useState<Record<string, boolean>>({
    internship: false,
    raise_gpa: false,
    join_club: false
  })
  const [newProbability, setNewProbability] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSimulate = async () => {
    setLoading(true)
    try {
      const result = await apiClient.runWhatIf(studentHash, modifications)
      setNewProbability(result.new_probability)
    } catch (error) {
      console.error('What-if simulation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const delta = newProbability !== null ? (newProbability - currentProbability) * 100 : 0
  const deltaColor = delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-600'

  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <p className="text-sm text-gray-600 uppercase tracking-wide mb-4">WHAT IF — Estimate impact of changes</p>

      <div className="space-y-3 mb-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={modifications.internship}
            onChange={(e) => setModifications({ ...modifications, internship: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Complete 12-week internship</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={modifications.raise_gpa}
            onChange={(e) => setModifications({ ...modifications, raise_gpa: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Raise CGPA to 2.9</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={modifications.join_club}
            onChange={(e) => setModifications({ ...modifications, join_club: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Join one student society</span>
        </label>
      </div>

      <button
        onClick={handleSimulate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Simulating...' : 'Run Simulation'}
      </button>

      {newProbability !== null && (
        <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-600">
          <p className="text-xs text-gray-600 mb-1">Estimated new probability</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-blue-600">
              {Math.round(newProbability * 100)}%
            </span>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current: {Math.round(currentProbability * 100)}%</p>
              <p className={`text-sm font-bold ${deltaColor}`}>
                {delta > 0 ? '+' : ''}{Math.round(delta)}pp
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
