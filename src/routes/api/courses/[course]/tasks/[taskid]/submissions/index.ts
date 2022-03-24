/**
 * ### GET `/courses/<course>/tasks/<taskid>/submissions`
 *
 * Returns the submissions for the user in this course and a given task. Requires header `Authorization: Bearer <valid (session) token>`. Returns an empty array if the taskid is invalid.
 *
 * ***Output***
 * ```
 * [
 *   {
 *     "id": <Integer>,
 *     "taskid": <Integer>,
 *     "timestamp": <Integer>,
 *     "content": <String>,
 *     "result_type" <String>,
 *     "simplified": {
 *       "compiler": {
 *         "stdout": <String>,
 *         "statusCode": <Integer>
 *       },
 *       "testCase": {
 *         "stdin": <String>,
 *         "stdout": <String>,
 *         "expectedStdout": <String>,
 *         "statusCode": <Integer>
 *       }
 *     },
 *     "score": <Float>
 *   },
 *   ...
 * ]
 * ```
 *
 * ***Errors***
 * - 400: Invalid header format
 * - 401: Invalid token
 * - 403: Course does not correspond with session course
 *
 *
 * ### POST `/courses/<course>/tasks/<taskid>/submissions`
 *
 * Submits a solution to the sandbox. Returns 200 on success. Requires header `Authorization: Bearer <valid (session) token>`.
 *
 * ***Input***
 * ```
 * {
 *   "submission": <String>
 * }
 * ```
 *
 * ***Output***
 * ```
 * -
 * ```
 *
 * ***Errors***
 * - 400: Invalid header or body format
 * - 401: Invalid token
 * - 403: Course does not correspond with session course
 */
import config from '$config';
import database from '$lib/database/database';
import { schemaAssetUnlocked } from '$lib/utils/types/assets';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ locals, params }) => {
  const user = locals.user;
  if (user.activeCourse !== params.course) {
    return { status: 403, body: 'Course does not correspond with session course' };
  }

  let submissions = await database('submissions')
    .join('courseTask', 'submissions.taskid', 'courseTask.taskid')
    .where('submissions.taskid', params.taskid)
    .andWhere('user', user.username)
    .andWhere('courseTask.course', params.course)
    .select(
      'submissions.id',
      'submissions.course',
      'submissions.taskid',
      'timestamp',
      'content',
      'resultType',
      'simplified',
      'details',
      'score'
    );

  return { body: submissions };
};

const asyncFilter = async (array: Array<any>, predicate: any) => {
  const results = await Promise.all(array.map(predicate));

  return array.filter((_v: any, index: string | number) => results[index]);
};

// Unlocks assets for the task with `taskid` for the user
const unlockAssets = async (taskid: number, user: string) => {
  let { unlockableAssets } = await database
    .table('courseTask')
    .where('taskid', taskid)
    .select('unlockableAssets')
    .first();
  let toUnlock = await asyncFilter(unlockableAssets, async (asset) => {
    return (
      (
        await database
          .table('unlockedAssets')
          .where('user', user)
          .andWhere('assetId', asset)
          .select('*')
      ).length === 0
    );
  });

  // Async map
  toUnlock = await Promise.all(
    toUnlock.map(async (asset) => {
      let row = schemaAssetUnlocked.validateSync({ user: user, assetId: asset });
      await database.table('unlockedAssets').insert(row);
      return asset;
    })
  );
  return toUnlock;
};

export const post: RequestHandler = async ({ request, locals, params }) => {
  const user = locals.user;
  const taskid = parseInt(params.taskid);
  const body = await request.json();
  const submission = body.submission;

  const course = await database.table('courses').where('name', params.course).first();
  if (!course) {
    return { status: 404, body: `Course ${course} not found!` };
  }

  const task = await database.table('tasks').where('taskid', taskid).first();
  if (!task) {
    return { status: 404, body: `Task ${taskid} not found!` };
  }

  let submissionResponse = await fetch(`${config.sandboxUrl}/evaluate`, {
    method: 'POST',
    body: JSON.stringify({
      taskid: taskid,
      lang: task.lang,
      submission: submission,
      tests: task.tests
    }),
    headers: { 'Content-Type': 'application/json' }
  });
  let result;
  if (parseInt(submissionResponse.headers.get('content-length')) > 1024) {
    result = {
      type: 'RUN_ERROR',
      score: 0,
      details: {
        error:
          'Die Sandbox hat einen zu großen Output generiert. Wahrscheinlich aufgrund einer Endlosschleife in der Abgabe.'
      },
      simplified: {
        compiler: {
          stdout: '',
          exitCode: 0
        },
        testCase: {
          stdout: undefined,
          expectedStdout: undefined,
          exitCode: 1
        }
      }
    };
  } else {
    result = await submissionResponse.json();
  }
  const submissionResult = {
    user: user.username,
    course: user.activeCourse,
    taskid: taskid,
    timestamp: new Date().getTime(),
    content: submission,
    resultType: result.type,
    simplified: result.simplified,
    details: result.details ? result.details : {},
    score: result.score
  };

  let newUnlockedAssets = [];
  if (result.score > 0.99999) newUnlockedAssets = await unlockAssets(taskid, user.username);

  await database('submissions').insert(submissionResult);

  return {
    status: 200,
    body: { result: submissionResult, newUnlockedAssets: newUnlockedAssets }
  };
};
