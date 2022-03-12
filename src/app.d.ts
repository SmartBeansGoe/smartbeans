/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface UserSession {
    username: string;
    displayName: string;
    passwordSet: boolean;
    ltiEnabled: boolean;
    activeCourse: string;
    expirationTime: number;
    avatar: Avatar;
  }
  interface Locals {
    user: UserSession;
    course: { name: string; title: string; config: CourseConfig };
  }
  interface Platform {}
  interface Session {
    user: UserSession;
    course: { name: string; title: string; config: CourseConfig };
  }
  interface Stuff {}
}
