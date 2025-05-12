'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function StudentsPerInstructorChart({
  data,
}: {
  data: { instructor: string; students: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="instructor" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="students" fill="#FF9800" />
      </BarChart>
    </ResponsiveContainer>
  )
}
