'use server';

import {
  getTotalStudents,
  getTotalCourses,
  getTotalEnrollments,
  getTopCourses,
  getCoursesBySubject,
  getStudentsPerCourse,
  getFailedCoursesCount,
  getPassingRateBySubject,
  getInstructorsPerCourse,
  getClassesPerCourse,
} from '@/lib/repository/statsRepo.js';

export async function getAllStats() {
  return {
    totalStudents: await getTotalStudents(),
    totalCourses: await getTotalCourses(),
    totalEnrollments: await getTotalEnrollments(),
    topCourses: await getTopCourses(),
    coursesBySubject: await getCoursesBySubject(),
    studentsPerCourse: await getStudentsPerCourse(),
    failedCourses: await getFailedCoursesCount(),
    passRateBySubject: await getPassingRateBySubject(),
    instructorsPerCourse: await getInstructorsPerCourse(),
    classesPerCourse: await getClassesPerCourse(),
  };
}
