import { getCourseMappingRow, getUserRow } from '$lib/database/queries';
import config from '$config';
import { isValidLTIRequest, schemaLTI, type LTIBody } from '$lib/utils/authentication/lti';
import type { RequestHandler } from '@sveltejs/kit';
import { createUser } from '$lib/utils/authentication/register';
import { createSession } from '$lib/session';

/**
 * ### POST `/auth/login/lti`
 *
 * LTI login.
 *
 * ***Input***
 * ```
 * LTI request
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
 */
export const post: RequestHandler = async ({ request, locals, url }) => {
  const requestBody = await request.formData();
  let jsonBody = {};
  requestBody.forEach(function (value, key) {
    jsonBody[key] = value;
  });

  if (!schemaLTI.isValidSync(jsonBody)) {
    return { status: 400, body: 'Invalid LTI body' };
  }
  const body: LTIBody = await schemaLTI.validate(jsonBody);

  if (!isValidLTIRequest(body, config.ltiConsumerSecret, url.href)) {
    return { status: 400, body: 'Invalid LTI request' };
  }

  const user = await getUserRow(body.lis_person_sourcedid);
  let username: string;

  if (!user) {
    username = body.lis_person_sourcedid;
    await createUser(username, null, body.lis_person_name_given);
  } else {
    username = user.username;
  }

  const studipId = body.context_id;
  const course = await getCourseMappingRow(studipId);
  if (!course) {
    return { status: 400, body: `Course ${studipId} not defined!` };
  }
  const token = await createSession(username, course.courseName);

  return {
    status: 302,
    body: { token: token },
    headers: {
      'set-cookie': [`token=${token}; path=/; SameSite=Lax; Secure`],
      'Content-Type': 'application/json',
      Location: '/'
    }
  };
};
