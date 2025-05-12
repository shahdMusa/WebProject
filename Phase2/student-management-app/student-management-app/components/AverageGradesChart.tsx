'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AverageGradesChart({
  data,
}: {
  data: { course: string; averageGrade: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="course" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
        <Bar dataKey="averageGrade" fill="#3f51b5" />
      </BarChart>
    </ResponsiveContainer>
  )
}
