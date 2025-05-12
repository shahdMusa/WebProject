'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts'

export default function PassRateByClassChart({
  data,
}: {
  data: { className: string; passRate: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="className" />
        <YAxis domain={[0, 100]}>
          <Label value="%" position="insideLeft" angle={-90} offset={0} />
        </YAxis>
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Bar dataKey="passRate" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  )
}
