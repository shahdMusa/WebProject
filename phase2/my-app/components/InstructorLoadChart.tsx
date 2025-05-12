import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function InstructorLoadChart({ data }: { data: { instructor: string; classes: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="instructor" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="classes" fill="#00C49F" />
      </BarChart>
    </ResponsiveContainer>
  )
}