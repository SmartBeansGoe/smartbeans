import database from '$lib/database/database';
import type { CourseMappingRow } from '$lib/utils/types/course';
import type { UserRow } from '$lib/utils/types/user';

export const getUserRow = (username: string): Promise<UserRow> => {
  return database
    .table('users')
    .where({
      username: username
    })
    .first();
};

export const getCourseMappingRow = (studipId: string): Promise<CourseMappingRow> => {
  return database
    .table('courseMapping')
    .where({
      studipId: studipId
    })
    .first();
};
