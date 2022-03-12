/**
 * ### POST `/api/auth/login`
 *
 * Password login.
 *
 * ***Input***
 * ```
 * {
 *   "username": <String>,
 *   "password": <String>,
 *   "course": <String>
 * }
 * ```
 *
 * ***Output***
 * ```
 * {
 *   "token": <String>
 * }
 * ```
 *
 * ***Errors***
 * - 400: Wrong input data
 * - 401: Wrong password
 * - 403: No password set for this user
 * - 404: Non-existing user or course
 */
import { courseExists, createSession } from '$lib/session';
import { getUserRow } from '$lib/database/queries';
import { passwordVerify } from '$lib/utils/authentication/password';
import type { UserRow } from '$lib/utils/types/user';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ request }) => {
  const userCredentials = await request.json();
  const password = userCredentials.password;
  const username = userCredentials.username;
  const course = userCredentials.course;

  if (!username || !password || !course) {
    return {
      status: 400,
      body: 'Wrong input data',
      headers: {
        'Content-Type': 'text/html'
      }
    };
  }

  let user: UserRow;
  try {
    user = await getUserRow(username);
  } catch (err) {
    return {
      status: 500,
      body: 'Database error',
      headers: {
        'Content-Type': 'text/html'
      }
    };
  }
  if (!user) {
    return {
      status: 404,
      body: 'User not found!',
      headers: {
        'Content-Type': 'text/html'
      }
    };
  }
  try {
    if (user.password === null) {
      return {
        status: 403,
        body: 'No password set for this user',
        headers: {
          'Content-Type': 'text/html'
        }
      };
    }
    if (await passwordVerify(user.password, password)) {
      let token: string;
      if (await courseExists(course)) {
        try {
          token = await createSession(username, course);
        } catch (err) {
          return {
            status: 500,
            body: err.message,
            headers: {
              'Content-Type': 'text/html'
            }
          };
        }
        return {
          status: 200,
          body: { token: token },
          headers: {
            'set-cookie': [`token=${token}; path=/; SameSite=Lax; Secure`]
          }
        };
      } else {
        return {
          status: 404,
          body: 'Course not found!',
          headers: {
            'Content-Type': 'text/html'
          }
        };
      }
    } else {
      return {
        status: 401,
        body: 'Wrong password',
        headers: {
          'Content-Type': 'text/html'
        }
      };
    }
  } catch (err) {
    return {
      status: 500,
      body: 'Error during password hashing.',
      headers: {
        'Content-Type': 'text/html'
      }
    };
  }
};
