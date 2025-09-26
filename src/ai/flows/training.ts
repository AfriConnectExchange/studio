'use server';
/**
 * @fileOverview Flows for the Training Hub.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

// --- Schemas ---

const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  instructor: z.string(),
  duration: z.string(),
  price: z.number(),
});

const EnrollmentInputSchema = z.object({
  courseId: z.string(),
  userId: z.string(),
});

const ProgressInputSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  lessonId: z.string(),
  status: z.enum(['completed', 'in_progress']),
});

const CertificateOutputSchema = z.object({
  certificateUrl: z.string(),
  userName: z.string(),
  courseName: z.string(),
  completionDate: z.string(),
});

const FlowOutputSchema = z.object({ success: z.boolean(), message: z.string() });

// --- Flows ---

const listCoursesFlow = ai.defineFlow(
  {
    name: 'listCoursesFlow',
    inputSchema: z.null(),
    outputSchema: z.array(CourseSchema),
  },
  async () => {
    console.log('Fetching list of courses.');
    // In a real app, fetch from Firestore.
    return [
      { id: 'COURSE-1', title: 'Digital Marketing for SMEs', instructor: 'Jane Doe', duration: '4 weeks', price: 99 },
      { id: 'COURSE-2', title: 'Introduction to E-commerce', instructor: 'John Smith', duration: '2 weeks', price: 49 },
    ];
  }
);

const enrollInCourseFlow = ai.defineFlow(
  {
    name: 'enrollInCourseFlow',
    inputSchema: EnrollmentInputSchema,
    outputSchema: FlowOutputSchema,
  },
  async (input) => {
    console.log(`Enrolling user ${input.userId} in course ${input.courseId}`);
    // In a real app, create an enrollment document in Firestore.
    return { success: true, message: 'Successfully enrolled in the course.' };
  }
);

const updateCourseProgressFlow = ai.defineFlow(
  {
    name: 'updateCourseProgressFlow',
    inputSchema: ProgressInputSchema,
    outputSchema: FlowOutputSchema,
  },
  async (input) => {
    console.log(`Updating progress for user ${input.userId} in course ${input.courseId}`);
    return { success: true, message: 'Progress updated.' };
  }
);

const generateCertificateFlow = ai.defineFlow(
  {
    name: 'generateCertificateFlow',
    inputSchema: z.object({ userId: z.string(), courseId: z.string() }),
    outputSchema: CertificateOutputSchema,
  },
  async (input) => {
    console.log(`Generating certificate for user ${input.userId} and course ${input.courseId}`);
    // In a real app, verify course completion and generate a PDF.
    return {
      certificateUrl: 'https://example.com/cert.pdf',
      userName: 'A. User',
      courseName: 'Digital Marketing for SMEs',
      completionDate: new Date().toLocaleDateString(),
    };
  }
);

// --- Exports ---

export async function listCourses() {
  return await listCoursesFlow(null);
}

export async function enrollInCourse(input: z.infer<typeof EnrollmentInputSchema>) {
  return await enrollInCourseFlow(input);
}

export async function updateCourseProgress(input: z.infer<typeof ProgressInputSchema>) {
  return await updateCourseProgressFlow(input);
}

export async function generateCertificate(input: { userId: string, courseId: string }) {
  return await generateCertificateFlow(input);
}
