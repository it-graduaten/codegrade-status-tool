import { SubmissionResult } from './../../types/submissionsResult';
import courses from "~~/static-data/courses"
import { Assignment } from "~~/types/assignment";
import { Submission } from '~~/types/submission';

export default defineEventHandler(async (event) => {
    // Get runtime config
    const config = useRuntimeConfig();
    // Get access token
    const accessToken = await $fetch("/api/login");
    const headers = { Authorization: `Bearer ${accessToken}` }
    // Get query parameters
    const query = useQuery(event)
    const courseId = <string>query.courseId;
    const studentNumber = <string>query.studentNumber;

    // Get userId from studentNumber
    const response: Array<{ id: number }> = await $fetch(`${config.codegradeApiUrl}/users?q=${studentNumber}`, {
        headers
    });
    // If no user is found, return an error
    if (response.length === 0) {
        return {
            statusCode: 404,
            body: `No user found with student number ${studentNumber}`
        }
    }
    // Get the first users id
    const userId = response[0].id;

    // Get all assignments for the course
    let assignments: Array<Assignment> = await $fetch(`${config.codegradeApiUrl}/courses/${courseId}/assignments`, {
        headers
    });
    // Sort assignments on name
    assignments = assignments.sort((a, b) => a.name.localeCompare(b.name));

    // Get all submissions for the user in the course
    const submissionResult: SubmissionResult = await $fetch(`${config.codegradeApiUrl}/courses/${courseId}/users/${userId}/submissions`, {
        headers
    });


    // Add grade to assignment
    assignments = assignments.map(assignment => {
        const submission: Array<Submission> = submissionResult[assignment.id];
        return {
            ...assignment,
            grade: submission.length > 0 ? submission[submission.length - 1].grade : null
        }
    });


    // Get the courses
    let course = courses.find(course => course.codegradeId == parseInt(courseId));

    // For each chapter in the course, clear the assignments
    course.chapters.forEach(chapter => {
        chapter.assignments = [];
    });

    assignments.forEach(assignment => {
        // Get the chapter number
        const chapterNumber = assignment.name.split(".")[0];
        // Get the chapter
        const chapter = course.chapters.find(chapter => chapter.number == chapterNumber);
        // Check if the assignment is mandatory, if the assignment contains an '*' it is mandatory
        const mandatory = assignment.name.includes("*");

        // If the chapter is found, add the assignment to the chapter
        if (chapter) {
            // Get grade for the assignment
            const submission: Array<Submission> = submissionResult[assignment.id];
            // Set deadline for the chapter
            chapter.deadline = mandatory ? assignment.deadline : chapter.deadline;
            // Add the assignment to the chapter
            chapter.assignments.push({
                ...assignment,
                grade: submission.length > 0 ? submission[submission.length - 1].grade : null,
                mandatory
            });
        }
    });

    return course;
})

