'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type TopCoursesChartProps = {
  data: {
    course: string
    students: number
  }[]
}

export default function TopCoursesChart({ data }: TopCoursesChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="course" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="students" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
