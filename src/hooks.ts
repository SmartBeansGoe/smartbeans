import config from '$config';
import { courseConfiguration, userCredentials } from '$lib/session';
import { sleep } from '$lib/utils/sleep';
import type { Course } from '$lib/utils/types/course';
import type { UserSession } from '$lib/utils/types/user';
import type { GetSession, Handle } from '@sveltejs/kit';
import cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
  const cookieString = event.request.headers.get('cookie');
  const cookies = cookieString ? cookie.parse(cookieString) : undefined;
  const path = event.url.pathname;
  let user: UserSession;
  let course: Course;

  if (path.startsWith('/api/admin')) {
    const authHeader = event.request.headers.get('Authorization');
    await sleep(100); // for security reasons
    if (!authHeader) {
      return new Response('401 Unauthorized', { status: 401 });
    }
    const authToken = authHeader.split(' ')[1];
    if (config.apiKeys.includes(authToken)) {
      return await resolve(event);
    } else {
      return new Response('401 Unauthorized', { status: 401 });
    }
  } else {
    try {
      user = await userCredentials(cookies.token);
      course = await courseConfiguration(user.activeCourse);
    } catch (err) {
      user = null;
      course = null;
    }
    if (!(path.startsWith('/auth') || path.startsWith('/api/auth'))) {
      if (path.startsWith('/api')) {
        if (user === null) {
          return new Response('401 Unauthorized', { status: 401 });
        }
      }
    }
  }

  event.locals.user = user;
  event.locals.course = course;

  return await resolve(event);
};

export const getSession: GetSession = async ({ locals }) => {
  return {
    user: locals.user,
    course: locals.course
  };
};
