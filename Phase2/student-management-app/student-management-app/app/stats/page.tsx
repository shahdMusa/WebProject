"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import TopCoursesChart from "../../components/TopCoursesChart";
import FailureRateChart from "../../components/FailureRateChart";
import StudentsPerYearChart from "../../components/StudentsPerYearChart";
import CourseCategoryChart from "../../components/CourseCategoryChart";
import InstructorLoadChart from "../../components/InstructorLoadChart";
import MostFailedCoursesChart from "../../components/MostFailedCoursesChart";
import PassRateByClassChart from "../../components/PassRateByClassChart";
import StudentsPerInstructorChart from "../../components/StudentsPerInstructorChart";
import AverageGradesChart from "../../components/AverageGradesChart";
import GenderDistributionChart from "../../components/GenderDistributionChart";

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/statistics")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error("Failed to fetch stats", err));
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-blue-600 font-semibold">Loading session...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700 font-medium">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Statistics Dashboard</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Grid of stat charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Top Courses">
          <TopCoursesChart data={stats.topCourses} />
        </StatCard>
        <StatCard title="Failure Rates">
          <FailureRateChart data={stats.failureRates} />
        </StatCard>
        <StatCard title="Students Per Year">
          <StudentsPerYearChart data={stats.studentsPerYear} />
        </StatCard>
        <StatCard title="Course Categories">
          <CourseCategoryChart data={stats.courseCategories} />
        </StatCard>
        <StatCard title="Instructor Load">
          <InstructorLoadChart data={stats.instructorLoadData} />
        </StatCard>
        <StatCard title="Most Failed Courses">
          <MostFailedCoursesChart data={stats.mostFailedCourses} />
        </StatCard>
        <StatCard title="Pass Rate By Class">
          <PassRateByClassChart data={stats.passRateByClass} />
        </StatCard>
        <StatCard title="Students Per Instructor">
          <StudentsPerInstructorChart data={stats.studentsPerInstructor} />
        </StatCard>
        <StatCard title="Average Grades">
          <AverageGradesChart data={stats.averageGrades} />
        </StatCard>
        <StatCard title="Gender Distribution">
          <GenderDistributionChart data={stats.genderDistribution} />
        </StatCard>
      </div>
    </div>
  );
}

function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 transition-transform transform hover:scale-105 hover:shadow-lg">
      <h2 className="text-lg font-semibold mb-2 text-center">{title}</h2>
      {children}
    </div>
  );
}
