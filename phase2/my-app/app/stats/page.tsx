import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { signOut } from "next-auth/react"

import {
  topCourses,
  failureRates,
  studentsPerYear,
  courseCategories,
  instructorLoadData,
  mostFailedCourses,
  passRateByClass,
  studentsPerInstructor,
  averageGrades,
  genderDistribution
} from "../../lib/mock-data"

import TopCoursesChart from "../../components/TopCoursesChart"
import FailureRateChart from "../../components/FailureRateChart"
import StudentsPerYearChart from "../../components/StudentsPerYearChart"
import CourseCategoryChart from "../../components/CourseCategoryChart"
import InstructorLoadChart from "../../components/InstructorLoadChart"
import MostFailedCoursesChart from "../../components/MostFailedCoursesChart"
import PassRateByClassChart from "../../components/PassRateByClassChart"
import StudentsPerInstructorChart from "../../components/StudentsPerInstructorChart"
import AverageGradesChart from "../../components/AverageGradesChart"
import GenderDistributionChart from "../../components/GenderDistributionChart"

export default async function StatsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600 font-semibold">
          Access denied. You must be signed in to view this page.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with title + logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">
          📊 Statistics Dashboard
        </h1>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Top Courses">
          <TopCoursesChart data={topCourses} />
        </StatCard>
        <StatCard title="Failure Rates">
          <FailureRateChart data={failureRates} />
        </StatCard>
        <StatCard title="Students Per Year">
          <StudentsPerYearChart data={studentsPerYear} />
        </StatCard>
        <StatCard title="Course Categories">
          <CourseCategoryChart data={courseCategories} />
        </StatCard>
        <StatCard title="Instructor Load">
          <InstructorLoadChart data={instructorLoadData} />
        </StatCard>
        <StatCard title="Most Failed Courses">
          <MostFailedCoursesChart data={mostFailedCourses} />
        </StatCard>
        <StatCard title="Pass Rate By Class">
          <PassRateByClassChart data={passRateByClass} />
        </StatCard>
        <StatCard title="Students Per Instructor">
          <StudentsPerInstructorChart data={studentsPerInstructor} />
        </StatCard>
        <StatCard title="Average Grades">
          <AverageGradesChart data={averageGrades} />
        </StatCard>
        <StatCard title="Gender Distribution">
          <GenderDistributionChart data={genderDistribution} />
        </StatCard>
      </div>
    </div>
  )
}

function StatCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 transition-transform transform hover:scale-105 hover:shadow-lg">
      <h2 className="text-lg font-semibold mb-2 text-center">{title}</h2>
      {children}
    </div>
  )
}
