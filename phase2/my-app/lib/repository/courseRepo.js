
import { prisma } from '@/lib/prisma/client.js';


export async function getTopCourses(limit = 3) {
  const result = await prisma.course.findMany({
    take: limit,
    orderBy: {
      classes: {
        _count: 'desc'
      }
    },
    include: {
      subject: true,
      classes: {
        include: {
          enrollments: true
        }
      }
    }
  });


  return result.map(course => ({
    id: course.id,
    name: course.name,
    subject: course.subjectName,
    totalEnrolled: course.classes.reduce(
      (sum, cls) => sum + cls.enrollments.length,
      0
    )
  }));
}
