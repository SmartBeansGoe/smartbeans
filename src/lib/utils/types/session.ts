export type SessionData = {
  username: string;
  courseName: string;
  expirationTime: number;
};

export interface SessionRow extends SessionData {
  token: string;
  tokenName?: string;
}
