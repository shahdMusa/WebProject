
import { prisma } from '@/lib/prisma/client.js';

export async function getStudentsByCourse(courseId) {
  const students = await prisma.student.findMany({
    where: {
      enrollments: {
        some: {
          class: {
            courseId: courseId
          }
        }
      }
    },
    include: {
      user: true
    }
  });
  return students.map(s => ({
    id: s.username,
    name: s.user.fullName
  }));
}

export async function getTotalStudents() {
  return await prisma.student.count();
}
