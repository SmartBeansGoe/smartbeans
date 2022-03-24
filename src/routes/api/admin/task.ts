import database from '$lib/database/database';
import { schemaTaskPost, type TaskPost } from '$lib/utils/types/task';
import type { RequestHandler } from '@sveltejs/kit';
import * as yup from 'yup';

const asyncFilter = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
};

/**
 * ### GET `/api/admin/task`
 *
 * Add new tasks with course task configurations.
 *
 * ***Input***
 * ```
 * {
 *     taskid: number,
 *     taskDescription: {
 *         defaultEditorInput: string,
 *         shortname: string,
 *         task: string,
 *         title: string,
 *     },
 *     lang: "python" | "c",
 *     solution: string,
 *     tests: string[],
 *     courseMetaData: [
 *       course: string,
 *       tags: [{
 *         name: string,
 *         points?: number,
 *       }],
 *       orderBy: number,
 *       prerequisites: [],
 *       unlockableAssets: [],
 *    ]
 * }
 * ```
 *
 * ***Output***
 * ```
 * {
 *   deleted: [] // unlockable assets which are not available
 * }
 * ```
 *
 * ***Errors***
 * - 400: Body Validation Error
 * - 401: Unauthorized
 */
export const post: RequestHandler = async ({ request }) => {
  const body = await request.json();
  let task: TaskPost;

  // Validate body data
  try {
    task = await schemaTaskPost.validate(body, { stripUnknown: true });
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

  let deletedUnlockableAssets = [];

  task.courseMetaData.forEach(async (courseMetaData) => {
    // Filter unlockable assets availability
    let assets: any;
    if (courseMetaData.unlockableAssets) {
      assets = await asyncFilter(courseMetaData.unlockableAssets, async (assetId) => {
        let asset = await database.table('assets').select('*').where('id', assetId).first();
        if (asset === undefined) deletedUnlockableAssets.push(assetId);
        return asset !== undefined;
      });
    }

    try {
      // Insert courseTask into database
      await database.table('courseTask').insert({
        taskid: task.taskid,
        course: courseMetaData.course,
        orderBy: courseMetaData.orderBy,
        prerequisites: JSON.stringify(courseMetaData.prerequisites), // knex needs a stringified json
        tags: JSON.stringify(courseMetaData.tags), // knex needs a stringified json
        unlockableAssets: JSON.stringify(assets) // knex needs a stringified json
      });
    } catch {
      // Update courseTask into database
      task.courseMetaData.forEach(async (courseMetaData) => {
        await database
          .table('courseTask')
          .update({
            orderBy: courseMetaData.orderBy,
            prerequisites: JSON.stringify(courseMetaData.prerequisites), // knex needs a stringified json
            tags: JSON.stringify(courseMetaData.tags), // knex needs a stringified json
            unlockableAssets: JSON.stringify(assets) // knex needs a stringified json
          })
          .where({ taskid: task.taskid, course: courseMetaData.course });
      });
    }
  });

  return { body: { deleted: { unlockableAssets: deletedUnlockableAssets } } };
};
