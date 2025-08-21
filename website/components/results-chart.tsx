'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from '@/components/ui/chart';

interface ResultsChartProps {
  serveFirstWinRate: number;
  chooseSideWinRate: number;
}

export function ResultsChart({
  serveFirstWinRate,
  chooseSideWinRate,
}: ResultsChartProps) {
  const data = [
    {
      name: 'Serve First',
      value: serveFirstWinRate * 100,
    },
    {
      name: 'Choose Side',
      value: chooseSideWinRate * 100,
    },
  ];

  const isServeFirstBetter = serveFirstWinRate > chooseSideWinRate;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
        <YAxis
          domain={[
            Math.min(
              Math.floor(serveFirstWinRate * 100 - 5),
              Math.floor(chooseSideWinRate * 100 - 5),
            ),
            Math.max(
              Math.ceil(serveFirstWinRate * 100 + 5),
              Math.ceil(chooseSideWinRate * 100 + 5),
            ),
          ]}
          label={{
            value: 'Win Probability (%)',
            angle: -90,
            position: 'insideLeft',
          }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number) => [
            `${value.toFixed(2)}%`,
            'Win Probability',
          ]}
          labelFormatter={(name) => `Strategy: ${name}`}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                index === 0 && isServeFirstBetter
                  ? '#22c55e'
                  : index === 1 && !isServeFirstBetter
                    ? '#3b82f6'
                    : '#94a3b8'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
