export const generateToken = (length: number) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
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
