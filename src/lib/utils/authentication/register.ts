import database from '$lib/database/database';
import { getRandomColor } from '../color';
import { passwordHash } from './password';

export const createUser = async (
  username: string,
  password?: string,
  displayName?: string
): Promise<boolean> => {
  if (password) {
    return createUserWithPassword(username, password, displayName);
  } else {
    return createUserWithoutPassword(username, displayName);
  }
};

const createUserWithoutPassword = async (
  username: string,
  displayName?: string
): Promise<boolean> => {
  try {
    await database.table('users').insert({
      username: username,
      displayName: displayName,
      ltiEnabled: true,
      avatar: { hat: null, pants: null, shirt: null, skin: getRandomColor() }
    });
    return true;
  } catch (e) {
    return false;
  }
};

const createUserWithPassword = async (
  username: string,
  password: string,
  displayName?: string
): Promise<boolean> => {
  const hash = await passwordHash(password);
  try {
    await database.table('users').insert({
      username: username,
      password: hash,
      ltiEnabled: false,
      displayName: displayName,
      avatar: { hat: null, pants: null, shirt: null, skin: getRandomColor() }
    });
    return true;
  } catch (e) {
    return false;
  }
};
