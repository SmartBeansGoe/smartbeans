import config from '$config';
import database from '$lib/database/database';
import type { Course } from '$lib/utils/types/course';
import type { SessionData } from '$lib/utils/types/session';
import type { UserRow, UserSession } from '$lib/utils/types/user';


export const expirationTime = () => {
  return new Date().getTime() + config.sessionDuration * 1000;
};

export const courseExists = async (course: string) => {
  try {
    return (await database.table('courses').select('name').where({ name: course })).length > 0;
  } catch (err) {
    throw new Error('Database Error');
  }
};

export const generateToken = (length: number) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

export const courseConfiguration = async (course: string): Promise<Course> => {
  let courseData: Course = await database
    .table('courses')
    .where({ name: course })
    .select('name', 'title', 'config')
    .first();

  return courseData;
};

export class WrongFormatError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, WrongFormatError.prototype);
  }
}

export class InvalidError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, InvalidError.prototype);
  }
}
