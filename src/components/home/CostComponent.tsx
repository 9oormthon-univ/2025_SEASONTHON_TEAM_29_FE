'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { month: '3월', cost: 280 },
  { month: '4월', cost: 310 },
  { month: '5월', cost: 305 },
  { month: '6월', cost: 310 },
  { month: '7월', cost: 315 },
  { month: '8월', cost: 320 },
];

export default function CostComponent() {
  const average = 320;

  return (
    <div className="w-full min-w-84 bg-white pt-5">
      <h2 className="text-lg font-bold text-text--default mb-1">
        2025년 가격 추이
      </h2>
      <p className="text-sm font-normal text-text--default mb-4 leading-relaxed">
        성수기는 비수기 대비 10~20% 가격이 상승해요!
        <br />
        8~12개월 전에 예약은 선택이 아닌 필수!
      </p>

      <div className="mb-2 text-text--secondary text-sm">스드메 평균가</div>

      <div className="flex items-baseline mb-5">
        <span className="text-[40px] font-bold text-primary-400 leading-none">
          {average}
        </span>
        <span className="ml-1 text-lg text-primary-400 font-medium align-baseline">
          만원
        </span>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-primary-100)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-text-secondary)' }}
            />
            <YAxis
              domain={[150, 350]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-text-tertiary)' }}
            />
            <Tooltip
              formatter={(v: number) => `${v}만원`}
              contentStyle={{
                borderRadius: 6,
                border: '1px solid var(--color-primary-100)',
                padding: '4px 8px',
                fontSize: '11px',
                lineHeight: '16px',
                backgroundColor: 'rgba(255,255,255,0.95)',
              }}
              itemStyle={{
                padding: 0,
                margin: 0,
              }}
              labelStyle={{
                fontSize: '10px',
                marginBottom: 2,
                color: 'var(--color-text--tertiary)',
              }}
            />
            <defs>
              <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-primary-300)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary-200)"
                  stopOpacity={0.4}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="cost"
              stroke="var(--color-primary-300)"
              strokeWidth={2}
              fill="url(#colorGrad)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
