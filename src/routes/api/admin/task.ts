import database from '$lib/database/database';
import { schemaTaskPost, type TaskPost } from '$lib/utils/types/task';
import type { RequestHandler } from '@sveltejs/kit';
import * as yup from 'yup';

export const post: RequestHandler = async ({ request }) => {
  const body = await request.json();
  let task: TaskPost;

  // Validate body data
  try {
    task = await schemaTaskPost.validate(body);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { status: 400, body: JSON.stringify(error.errors) };
    }
  }

  try {
    // Insert task into database
    await database.table('tasks').insert({
      taskid: task.taskid,
      lang: task.lang,
      solution: task.solution,
      taskDescription: JSON.stringify(task.taskDescription), // knex needs a stringified json
      tests: JSON.stringify(task.tests) // knex needs a stringified json
    });
  } catch {
    // Update task into database when not existing
    await database
      .table('tasks')
      .update({
        lang: task.lang,
        solution: task.solution,
        taskDescription: JSON.stringify(task.taskDescription), // knex needs a stringified json
        tests: JSON.stringify(task.tests) // knex needs a stringified json
      })
      .where({ taskid: task.taskid });
  }

  task.courseMetaData.forEach(async (courseMetaData) => {
    try {
      // Insert courseTask into database
      await database.table('courseTask').insert({
        taskid: task.taskid,
        course: courseMetaData.course,
        orderBy: courseMetaData.orderBy,
        prerequisites: JSON.stringify(courseMetaData.prerequisites), // knex needs a stringified json
        tags: JSON.stringify(courseMetaData.tags) // knex needs a stringified json
      });
    } catch {
      // Update courseTask into database
      task.courseMetaData.forEach(async (courseMetaData) => {
        await database
          .table('courseTask')
          .update({
            orderBy: courseMetaData.orderBy,
            prerequisites: JSON.stringify(courseMetaData.prerequisites), // knex needs a stringified json
            tags: JSON.stringify(courseMetaData.tags) // knex needs a stringified json
          })
          .where({ taskid: task.taskid, course: courseMetaData.course });
      });
    }
  });

  return {};
};
