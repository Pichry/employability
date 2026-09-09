import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { apiClient } from '../api/client';
export function WhatIfSimulator({ studentHash, currentProbability }) {
    const [modifications, setModifications] = useState({
        internship: false,
        raise_gpa: false,
        join_club: false
    });
    const [newProbability, setNewProbability] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSimulate = async () => {
        setLoading(true);
        try {
            const result = await apiClient.runWhatIf(studentHash, modifications);
            setNewProbability(result.new_probability);
        }
        catch (error) {
            console.error('What-if simulation failed:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const delta = newProbability !== null ? (newProbability - currentProbability) * 100 : 0;
    const deltaColor = delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-600';
    return (_jsxs("div", { className: "border rounded-lg p-6 bg-gray-50", children: [_jsx("p", { className: "text-sm text-gray-600 uppercase tracking-wide mb-4", children: "WHAT IF \u2014 Estimate impact of changes" }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsxs("label", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", checked: modifications.internship, onChange: (e) => setModifications({ ...modifications, internship: e.target.checked }), className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Complete 12-week internship" })] }), _jsxs("label", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", checked: modifications.raise_gpa, onChange: (e) => setModifications({ ...modifications, raise_gpa: e.target.checked }), className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Raise CGPA to 2.9" })] }), _jsxs("label", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", checked: modifications.join_club, onChange: (e) => setModifications({ ...modifications, join_club: e.target.checked }), className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Join one student society" })] })] }), _jsx("button", { onClick: handleSimulate, disabled: loading, className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400", children: loading ? 'Simulating...' : 'Run Simulation' }), newProbability !== null && (_jsxs("div", { className: "mt-4 p-3 bg-white rounded border-l-4 border-blue-600", children: [_jsx("p", { className: "text-xs text-gray-600 mb-1", children: "Estimated new probability" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-3xl font-bold text-blue-600", children: [Math.round(newProbability * 100), "%"] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Current: ", Math.round(currentProbability * 100), "%"] }), _jsxs("p", { className: `text-sm font-bold ${deltaColor}`, children: [delta > 0 ? '+' : '', Math.round(delta), "pp"] })] })] })] }))] }));
}
