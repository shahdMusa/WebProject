import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function MostFailedCoursesChart({
  data,
}: {
  data: { course: string; failed: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={data}>
        <XAxis type="number" />
        <YAxis dataKey="course" type="category" />
        <Tooltip />
        <Bar dataKey="failed" fill="#FF6B6B" />
      </BarChart>
    </ResponsiveContainer>
  )
}