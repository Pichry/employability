import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
export function RiskDrivers({ drivers }) {
    const chartData = drivers.map(d => ({
        name: d.feature_name,
        value: d.shap_value,
        direction: d.direction,
        modifiable: d.modifiable
    }));
    return (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 uppercase tracking-wide mb-4", children: "WHY \u2014 Contribution to this prediction" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: chartData, layout: "vertical", margin: { top: 5, right: 30, left: 300, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { type: "number" }), _jsx(YAxis, { dataKey: "name", type: "category", width: 280, tick: { fontSize: 12 } }), _jsx(Tooltip, { formatter: (value) => value.toFixed(3) }), _jsx(Bar, { dataKey: "value", fill: "#8884d8", radius: [0, 8, 8, 0], children: chartData.map((entry, index) => (_jsx(Cell, { fill: entry.direction === 'negative' ? '#dc2626' : '#16a34a' }, `cell-${index}`))) })] }) }), _jsx("div", { className: "mt-4 grid gap-2", children: drivers.map((driver, idx) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-gray-50 rounded text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: driver.feature_name }), _jsx("span", { className: `ml-2 text-xs px-2 py-1 rounded ${driver.modifiable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`, children: driver.modifiable ? 'MODIFIABLE' : 'STRUCTURAL' })] }), _jsxs("span", { className: `font-bold ${driver.direction === 'negative' ? 'text-red-600' : 'text-green-600'}`, children: [driver.shap_value > 0 ? '+' : '', driver.shap_value.toFixed(2)] })] }, idx))) })] }));
}
