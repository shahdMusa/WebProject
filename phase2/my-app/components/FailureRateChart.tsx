'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type FailureRateData = {
  course: string
  failRate: number
}

export default function FailureRateChart({ data }: { data: FailureRateData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="course" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="failRate" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}
