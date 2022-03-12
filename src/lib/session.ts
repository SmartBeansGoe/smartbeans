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
