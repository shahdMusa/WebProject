import { prisma } from '@/lib/prisma/client.js';

export async function getTotalStudents() {
  return await prisma.student.count();
}

export async function getTotalCourses() {
  return await prisma.course.count();
}

export async function getTotalEnrollments() {
  return await prisma.enrollment.count();
}

export async function getTopCourses(limit = 3) {
  const courses = await prisma.course.findMany({
    take: limit,
    orderBy: {
      classes: {
        _count: 'desc',
      },
    },
    include: {
      classes: {
        include: {
          enrollments: true,
        },
      },
    },
  });

  return courses.map(course => ({
    id: course.id,
    name: course.name,
    totalStudents: course.classes.reduce((sum, cls) => sum + cls.enrollments.length, 0),
  }));
}

export async function getCoursesBySubject() {
  const subjects = await prisma.subject.findMany({
    include: {
      courses: true,
    },
  });

  return subjects.map(s => ({
    subject: s.name,
    courseCount: s.courses.length,
  }));
}

export async function getStudentsPerCourse() {
  const courses = await prisma.course.findMany({
    include: {
      classes: {
        include: {
          enrollments: true,
        },
      },
    },
  });

  return courses.map(c => ({
    course: c.name,
    studentCount: c.classes.reduce((acc, cls) => acc + cls.enrollments.length, 0),
  }));
}

export async function getFailedCoursesCount() {
  const failed = await prisma.completedCourse.groupBy({
    by: ['courseId'],
    where: {
      grade: {
        in: ['F', 'D', 'Fail'],
      },
    },
    _count: true,
  });

  return failed.map(f => ({
    courseId: f.courseId,
    failCount: f._count,
  }));
}

export async function getPassingRateBySubject() {
  const subjects = await prisma.subject.findMany({
    include: {
      courses: {
        include: {
          completedBy: true,
        },
      },
    },
  });

  return subjects.map(subject => {
    let total = 0;
    let passed = 0;
    subject.courses.forEach(course => {
      course.completedBy.forEach(record => {
        total++;
        if (!['F', 'D', 'Fail'].includes(record.grade)) passed++;
      });
    });

    return {
      subject: subject.name,
      passRate: total === 0 ? 0 : (passed / total * 100).toFixed(2),
    };
  });
}

export async function getInstructorsPerCourse() {
  const courses = await prisma.course.findMany({
    include: {
      classes: {
        include: {
          instructor: true,
        },
      },
    },
  });

  return courses.map(c => ({
    course: c.name,
    instructorCount: new Set(c.classes.map(cls => cls.instructorId)).size,
  }));
}

export async function getClassesPerCourse() {
  const data = await prisma.course.findMany({
    include: {
      classes: true,
    },
  });

  return data.map(course => ({
    course: course.name,
    classCount: course.classes.length,
  }));
}
