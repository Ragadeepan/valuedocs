import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORIES } from '../../utils/constants';

const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#06b6d4', '#64748b', '#f43f5e',
];

export default function StorageChart({ data = [] }) {
  const chartData = data.length > 0 ? data : CATEGORIES.map((cat, i) => ({
    name: cat.label,
    value: Math.floor(Math.random() * 50) + 5,
    icon: cat.icon,
  }));

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">Storage by Category</h3>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">Document distribution</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
          <HardDrive className="w-5 h-5 text-violet-600" />
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 15, 26, 0.9)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '12px',
                color: '#f1f5f9',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {chartData.slice(0, 6).map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="text-dark-600 dark:text-dark-400 truncate">{item.icon} {item.name}</span>
            <span className="ml-auto text-dark-900 dark:text-white font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
