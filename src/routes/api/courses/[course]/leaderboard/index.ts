import database from '$lib/database/database';
import type { Tag } from '$lib/utils/types/tag';
import type { Avatar } from '$lib/utils/types/avatar';
import config from '$config';
import { serverRequestCache } from '$lib/utils/cache';
import type { RequestHandler } from '@sveltejs/kit';

const calcLeaderboard = async (course: string) => {
  type CorrectSubmission = {
    tags: Tag[];
    taskid: number;
    username: string;
    displayName: string;
    timestamp: number;
    avatar: Avatar;
  };
  let allCorrectSubmissions: CorrectSubmission[] = await database
    .table('submissions')
    .join('courseTask', 'submissions.taskid', 'courseTask.taskid')
    .where('courseTask.course', course)
    .andWhere('score', '>=', 0.9999)
    .join('users', 'username', 'user')
    .select('tags', 'submissions.taskid', 'username', 'displayName', 'timestamp', 'avatar');

  let users = allCorrectSubmissions.reduce((prev, curr) => {
    if (prev[curr.username] === undefined) {
      prev[curr.username] = {};
    }
    if (prev[curr.username][curr.taskid] === undefined) {
      prev[curr.username][curr.taskid] = curr;
    } else if (prev[curr.username][curr.taskid].timestamp < curr.timestamp) {
      prev[curr.username][curr.taskid] = curr;
    }
    return prev;
  }, {});
  let data = Object.entries(users)
    .map(([key, value]) => {
      let submissions: CorrectSubmission[] = Object.values(value);
      let points = submissions
        .map((submission: CorrectSubmission) =>
          submission.tags.filter((tag: Tag) => tag.points).map((tag) => tag.points)
        )
        .flat()
        .reduce((a, b) => a + b);
      let lastSubmissionTimestamp = Math.max(
        ...submissions.map((submission: CorrectSubmission) => submission.timestamp)
      );
      let avatar = submissions[0].avatar;
      return {
        user: key,
        name: submissions[0].displayName,
        points: points,
        avatar: avatar,
        lastAt: lastSubmissionTimestamp
      };
    })
    .filter((x) => Date.now() - config.leaderboardUsersLastSubmissionTimeout < x.lastAt);

  data.sort((a, b) => b.points - a.points);
  return data;
};

export const get: RequestHandler = async ({ params, locals }) => {
  const course = params.course;
  let data = serverRequestCache(
    `leaderboard-${course}`,
    60000 /* 1min caching */,
    async () => await calcLeaderboard(course)
  );

  const user = locals.user;
  let leaderboard = await data;
  leaderboard = leaderboard.map((leader) => {
    return {
      name: leader.name,
      points: leader.points,
      avatar: leader.avatar,
      me: leader.user === user.username
    };
  });

  return { body: leaderboard };
};
