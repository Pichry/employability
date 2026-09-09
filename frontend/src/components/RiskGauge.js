import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
export function RiskGauge({ probability, ci_low, ci_high, risk_segment }) {
    const percentage = Math.round(probability * 100);
    const ciLowPct = Math.round(ci_low * 100);
    const ciHighPct = Math.round(ci_high * 100);
    const riskColor = risk_segment === 'HIGH' ? 'text-red-600' : risk_segment === 'MEDIUM' ? 'text-amber-600' : 'text-green-600';
    const bgColor = risk_segment === 'HIGH' ? 'bg-red-50 border-red-200' : risk_segment === 'MEDIUM' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200';
    const icon = risk_segment === 'HIGH' ? AlertTriangle : risk_segment === 'MEDIUM' ? AlertCircle : CheckCircle;
    const Icon = icon;
    return (_jsxs("div", { className: `border rounded-lg p-6 ${bgColor}`, children: [_jsx("p", { className: "text-sm text-gray-600 uppercase tracking-wide mb-2", children: "Predicted Employability \u00B7 12 Months" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: `text-5xl font-bold ${riskColor}`, children: [percentage, "%"] }), _jsxs("p", { className: "text-xs text-gray-600 mt-2", children: ["CI ", ciLowPct, "\u2013", ciHighPct, "%"] })] }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(Icon, { className: `w-12 h-12 ${riskColor}` }), _jsxs("span", { className: `text-sm font-bold ${riskColor}`, children: [risk_segment, " RISK"] })] })] })] }));
}
