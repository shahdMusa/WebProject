// seed.js
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const seed = async () => {
    // Reset DB
    await prisma.completedCourse.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.class.deleteMany();
    await prisma.prerequisite.deleteMany();
    await prisma.course.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.student.deleteMany();
    await prisma.instructor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    // Roles
    const userRole = [
        "student",
        "instructor",
        "admin"
    ];

    for (let name of userRole) {
        await prisma.role.create({
            data: { name }
        });
    }

    // Subjects
    const subjectNames = [
        "Mathematics",
        "computer science",
        "Physics",
        "Biology",
        "Chemistry",
        "English"
    ];

    const subjects = [];
    for (const name of subjectNames) {
        const subject = await prisma.subject.create({
            data: { name }
        });
        subjects.push(subject);
    }

    // Courses
    const courses = [];
    for (let i = 0; i < 20; i++) {
        const course = await prisma.course.create({
            data: {
                id: faker.string.uuid(),
                name: faker.company.catchPhrase(),
                subjectName: faker.helpers.arrayElement(subjects).name,
                status: faker.helpers.arrayElement(['open', 'close']),
            },
        });
        courses.push(course);
    }

    // Course prerequisites
    for (let i = 0; i < 10; i++) {
        const course = faker.helpers.arrayElement(courses);
        const prereq = faker.helpers.arrayElement(courses.filter(c => c.id !== course.id));
        await prisma.prerequisite.create({
            data: {
                courseId: course.id,
                prerequisiteId: prereq.id,
                passed: true,
            },
        });
    }

    // Admin
    for (let i = 0; i < 5; i++) {
        const username = faker.internet.username();
        const userData = {
            username,
            password: faker.internet.password(),
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            role: {
                connect: {
                    name: "admin"
                },
            }
        };
        await prisma.user.create({
            data: userData
        });
    }

    // Instructors 
    const instructors = [];
    for (let i = 0; i < 5; i++) {
        const username = faker.internet.username();
        const userData = {
            username,
            password: faker.internet.password(),
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            role: {
                connect: {
                    name: "instructor"
                },
            },
            instructor: {
                create: {
                    username,
                },
            },
        };

        const instructor = await prisma.user.create({
            data: userData
        });
        instructors.push(instructor);
    }

    // Students
    const students = [];

    for (let i = 0; i < 30; i++) {
        const username = faker.internet.username();
        const userData = {
            username,
            password: faker.internet.password(),
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            role: {
                connect: { name: "student" },
            },
            student: {
                create: {
                    username,
                    loggedIn: false,
                },
            },
        };

        const student = await prisma.user.create({
            data: userData
        });
        students.push(student);
    }

    // Classes
    const classes = [];
    for (let i = 0; i < 15; i++) {
        const course = faker.helpers.arrayElement(courses);
        const instructor = faker.helpers.arrayElement(instructors);
        const classObj = await prisma.class.create({
            data: {
                CRN: faker.string.uuid(),
                schedule: faker.helpers.arrayElement(['MWF 9-10', 'TTh 10-11:30', 'MW 2-3:30']),
                capacity: faker.number.int({ min: 10, max: 30 }),
                courseId: course.id,
                instructorId: instructor.username,
            },
        });
        classes.push(classObj);
    }

    // Enrollments
    for (const student of students) {
        const studentClasses = faker.helpers.arrayElements(classes, 3);
        for (const classObj of studentClasses) {
            await prisma.enrollment.create({
                data: {
                    studentId: student.username,
                    classId: classObj.CRN,
                    status: faker.helpers.arrayElement(['registered', 'pending']),
                },
            });
        }
    }

    // Completed Courses
    for (const student of students) {
        const finishedCourses = faker.helpers.arrayElements(courses, 3);
        for (const course of finishedCourses) {
            await prisma.completedCourse.create({
                data: {
                    studentId: student.username,
                    courseId: course.id,
                    grade: faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
                },
            });
        }
    }

};

try {
    await seed();
    await prisma.$disconnect();
} catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
}

