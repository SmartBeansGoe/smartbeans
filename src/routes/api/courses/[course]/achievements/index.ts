import database from '$lib/database/database';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * GET `/courses/<course>/achievements`
 *
 * Returns all achievements with information about unlocked state, svg path and general information.
 * Requires header `Authorization: Bearer <valid (session) token>`.
 *
 * ***Output***
 * ```
 * [
 *   {
 *     "id": <Integer>,
 *     "unlocked": <Integer (TimeStamp)> | null,
 *     "title": <String>,
 *     "description": <String>,
 *     "svgPath": <String>,
 *   },
 *   ...
 * ]
 *
 * ***Errors***
 * - 400: Invalid header format
 * - 401: Invalid token
 * - 403: Course does not correspond with session course
 */
export const get: RequestHandler = async ({ locals, params }) => {
  const user = locals.user;
  if (user.activeCourse !== params.course) {
    return { status: 403, body: 'Course does not correspond with session course' };
  }

  const achievementRows = await database
    .table('achievements')
    .join('courseAchievement', 'achievements.id', 'courseAchievement.achievementId')
    .where({ course: user.activeCourse, enabled: true })
    .select('id', 'svgPath', 'details', 'hidden');

  const unlockedAchievements = await database('achievementUnlocked').where({
    username: user.username
  });

  let achievements = achievementRows
    .map((achievement) => {
      let unlocked = unlockedAchievements.find((u) => u.achievementId === achievement.id);
      if (unlocked) {
        return {
          id: achievement.id,
          unlocked: unlocked.unlocked,
          svgPath: achievement.svgPath,
          title: achievement.details.unlocked.title,
          description: achievement.details.unlocked.description
        };
      } else {
        if (!achievement.hidden)
          return {
            id: achievement.id,
            unlocked: null,
            svgPath: achievement.svgPath,
            title: achievement.details.title,
            description: achievement.details.description
          };
      }
    })
    .filter((a) => a);

  return { body: achievements };
};
