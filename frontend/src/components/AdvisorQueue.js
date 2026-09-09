import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
export function AdvisorQueue({ onSelectStudent }) {
    const [queue, setQueue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        const loadQueue = async () => {
            try {
                const data = await apiClient.getMyQueue();
                setQueue(data);
            }
            catch (error) {
                console.error('Failed to load queue:', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadQueue();
    }, []);
    if (loading)
        return _jsx("div", { className: "p-4 text-center", children: "Loading queue..." });
    if (!queue)
        return _jsx("div", { className: "p-4 text-center text-red-600", children: "Failed to load queue" });
    const filtered = queue.students.filter(s => {
        if (filter === 'all')
            return true;
        return s.risk_segment.toLowerCase() === filter;
    });
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "p-4 bg-red-50 rounded-lg border border-red-200", children: [_jsx("p", { className: "text-sm text-gray-600", children: "HIGH RISK" }), _jsx("p", { className: "text-2xl font-bold text-red-600", children: queue.high_risk })] }), _jsxs("div", { className: "p-4 bg-amber-50 rounded-lg border border-amber-200", children: [_jsx("p", { className: "text-sm text-gray-600", children: "MEDIUM RISK" }), _jsx("p", { className: "text-2xl font-bold text-amber-600", children: queue.medium_risk })] }), _jsxs("div", { className: "p-4 bg-green-50 rounded-lg border border-green-200", children: [_jsx("p", { className: "text-sm text-gray-600", children: "LOW RISK" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: queue.low_risk })] }), _jsxs("div", { className: "p-4 bg-blue-50 rounded-lg border border-blue-200", children: [_jsx("p", { className: "text-sm text-gray-600", children: "TOTAL" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: queue.total })] })] }), _jsx("div", { className: "flex gap-2 mb-4", children: ['all', 'high', 'medium', 'low'].map(f => (_jsx("button", { onClick: () => setFilter(f), className: `px-4 py-2 rounded text-sm font-medium ${filter === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: f.charAt(0).toUpperCase() + f.slice(1) }, f))) }), _jsx("div", { className: "space-y-2", children: filtered.map((student) => {
                    const Icon = student.risk_segment === 'HIGH' ? AlertTriangle : student.risk_segment === 'MEDIUM' ? AlertCircle : CheckCircle;
                    const color = student.risk_segment === 'HIGH' ? 'border-red-300' : student.risk_segment === 'MEDIUM' ? 'border-amber-300' : 'border-green-300';
                    return (_jsx("div", { onClick: () => onSelectStudent(student.student_hash), className: `p-4 border-l-4 ${color} bg-white rounded cursor-pointer hover:shadow-md transition`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1", children: [_jsx(Icon, { className: "w-5 h-5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: student.name }), _jsxs("p", { className: "text-xs text-gray-600", children: [student.risk_segment, " RISK"] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-lg font-bold", children: [Math.round(student.probability * 100), "%"] }), student.due_at && _jsxs("p", { className: "text-xs text-gray-600", children: ["Due: ", new Date(student.due_at).toLocaleDateString()] })] })] }) }, student.student_hash));
                }) })] }));
}
