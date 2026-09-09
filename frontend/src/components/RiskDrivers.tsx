import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import type { RiskDriver } from '../types'

interface RiskDriversProps {
  drivers: RiskDriver[]
}

export function RiskDrivers({ drivers }: RiskDriversProps) {
  const chartData = drivers.map(d => ({
    name: d.feature_name,
    value: d.shap_value,
    direction: d.direction,
    modifiable: d.modifiable
  }))

  return (
    <div>
      <p className="text-sm text-gray-600 uppercase tracking-wide mb-4">WHY — Contribution to this prediction</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 300, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={280} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => value.toFixed(3)} />
          <Bar dataKey="value" fill="#8884d8" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.direction === 'negative' ? '#dc2626' : '#16a34a'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid gap-2">
        {drivers.map((driver, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
            <div>
              <span className="font-medium">{driver.feature_name}</span>
              <span className={`ml-2 text-xs px-2 py-1 rounded ${driver.modifiable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                {driver.modifiable ? 'MODIFIABLE' : 'STRUCTURAL'}
              </span>
            </div>
            <span className={`font-bold ${driver.direction === 'negative' ? 'text-red-600' : 'text-green-600'}`}>
              {driver.shap_value > 0 ? '+' : ''}{driver.shap_value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
