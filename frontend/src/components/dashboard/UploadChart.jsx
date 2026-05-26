import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useUploadTrend } from '../../hooks/useDashboard';
import { format } from 'date-fns';

const generateMockData = () => {
  const days = 7;
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: format(date, 'MMM dd'),
      uploads: Math.floor(Math.random() * 10) + 1,
    };
  });
};

export default function UploadChart() {
  const [period, setPeriod] = useState('7d');
  const { data: trendData } = useUploadTrend(period);
  const chartData = trendData?.length > 0 ? trendData : generateMockData();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">Upload Activity</h3>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">Documents uploaded over time</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 15, 26, 0.9)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '12px',
                color: '#f1f5f9',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="uploads"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#uploadGrad)"
              dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
