import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AdvisorQueue } from './components/AdvisorQueue';
import { StudentDetail } from './pages/StudentDetail';
import './App.css';
export function App() {
    const [view, setView] = useState('queue');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const handleSelectStudent = (studentHash) => {
        setSelectedStudent(studentHash);
        setView('detail');
    };
    const handleBack = () => {
        setView('queue');
        setSelectedStudent(null);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white border-b sticky top-0 z-40", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold", children: "Employability \u00B7 Advisor Portal" }), _jsx("div", { className: "text-sm text-gray-600", children: "Advisor \u00B7 Dept of IS" })] }) }), _jsx("main", { className: "max-w-7xl mx-auto px-6 py-8", children: view === 'queue' && selectedStudent === null ? (_jsx(AdvisorQueue, { onSelectStudent: handleSelectStudent })) : (selectedStudent && _jsx(StudentDetail, { studentHash: selectedStudent, onBack: handleBack })) }), _jsx("footer", { className: "mt-12 py-6 border-t text-center text-xs text-gray-500", children: _jsx("p", { children: "Graduate Employability Prediction System v0.1 \u00B7 Every view is logged" }) })] }));
}
export default App;
