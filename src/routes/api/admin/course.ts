import database from '$lib/database/database';
import { schemaCourse, type Course } from '$lib/utils/types/course';
import type { RequestHandler } from '@sveltejs/kit';
import * as yup from 'yup';

export const post: RequestHandler = async ({ request }) => {
  const body = await request.json();
  let course: Course;

  // Validate body data
  try {
    course = await schemaCourse.validate(body);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { status: 400, body: JSON.stringify(error.errors) };
    }
  }

  try {
    // Insert course into database
    await database.table('courses').insert(course);
  } catch {
    // Update course into database when not existing
    await database.table('courses').update(course).where('name', course.name);
  }

  return {};
};
