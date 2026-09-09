import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { RiskGauge } from '../components/RiskGauge';
import { RiskDrivers } from '../components/RiskDrivers';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
export function StudentDetail({ studentHash, onBack }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [caseNote, setCaseNote] = useState('');
    useEffect(() => {
        const loadDetail = async () => {
            try {
                const data = await apiClient.getStudentDetail(studentHash);
                setDetail(data);
            }
            catch (error) {
                console.error('Failed to load student detail:', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [studentHash]);
    if (loading)
        return _jsx("div", { className: "p-8 text-center", children: "Loading..." });
    if (!detail)
        return _jsx("div", { className: "p-8 text-center text-red-600", children: "Failed to load student" });
    const { student, prediction, drivers, case: caseData } = detail;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("button", { onClick: onBack, className: "text-blue-600 hover:underline mb-4", children: "\u2190 Back to queue" }), _jsx("div", { className: "bg-white border rounded-lg p-6", children: _jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: student.name }), _jsxs("p", { className: "text-gray-600 mt-1", children: [student.program_id, " \u00B7 Year 3 \u00B7 ", student.credits_earned, "/", student.credits_attempted, " credits"] })] }) }) }), _jsxs("div", { className: "grid grid-cols-3 gap-6", children: [_jsx("div", { children: _jsx(RiskGauge, { probability: prediction.probability, ci_low: prediction.ci_low, ci_high: prediction.ci_high, risk_segment: prediction.risk_segment }) }), _jsx("div", { children: _jsx(WhatIfSimulator, { studentHash: studentHash, currentProbability: prediction.probability }) })] }), _jsx("div", { className: "bg-white border rounded-lg p-6", children: _jsx(RiskDrivers, { drivers: drivers }) }), _jsxs("div", { className: "bg-white border rounded-lg p-6", children: [_jsx("p", { className: "text-sm text-gray-600 uppercase tracking-wide mb-4", children: "CASE LOG" }), _jsx("textarea", { value: caseNote, onChange: (e) => setCaseNote(e.target.value), placeholder: "Log what you discussed...", className: "w-full p-3 border rounded mb-2 text-sm", rows: 3 }), _jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium", children: "Log Contact" })] })] }));
}
