import type { Avatar } from './avatar';

export type UserSession = {
  username: string;
  displayName: string;
  passwordSet: boolean;
  ltiEnabled: boolean;
  activeCourse: string;
  expirationTime: number;
  avatar: Avatar;
};

export type UserRow = {
  username: string;
  displayName: string;
  password: string;
  ltiEnabled: boolean;
  avatar: Avatar;
};
