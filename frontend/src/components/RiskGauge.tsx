import React from 'react'
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

interface RiskGaugeProps {
  probability: number
  ci_low: number
  ci_high: number
  risk_segment: 'HIGH' | 'MEDIUM' | 'LOW'
}

export function RiskGauge({ probability, ci_low, ci_high, risk_segment }: RiskGaugeProps) {
  const percentage = Math.round(probability * 100)
  const ciLowPct = Math.round(ci_low * 100)
  const ciHighPct = Math.round(ci_high * 100)

  const riskColor = risk_segment === 'HIGH' ? 'text-red-600' : risk_segment === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'
  const bgColor = risk_segment === 'HIGH' ? 'bg-red-50 border-red-200' : risk_segment === 'MEDIUM' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'
  const icon = risk_segment === 'HIGH' ? AlertTriangle : risk_segment === 'MEDIUM' ? AlertCircle : CheckCircle

  const IconComponent = icon

  return (
    <div className={`border rounded-lg p-6 ${bgColor}`}>
      <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Predicted Employability · 12 Months</p>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className={`text-5xl font-bold ${riskColor}`}>{percentage}%</div>
          <p className="text-xs text-gray-600 mt-2">CI {ciLowPct}–{ciHighPct}%</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <IconComp className={`w-12 h-12 ${riskColor}`} />
          <span className={`text-sm font-bold ${riskColor}`}>{risk_segment} RISK</span>
        </div>
      </div>
    </div>
  )
}
