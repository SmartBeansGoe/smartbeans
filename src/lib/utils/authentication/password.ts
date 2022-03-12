import database from '$lib/database/database';
import * as argon2 from 'argon2';

export const passwordVerify = async (hash: string, password: string) => {
  return await argon2.verify(hash, password);
};

export const passwordHash = async (password: string) => {
  return await argon2.hash(password);
};

export const getPasswordHashOfUser = async (username: string) => {
  return (await database.table('users').where({ username: username }).select('password').first())
    .password;
};
