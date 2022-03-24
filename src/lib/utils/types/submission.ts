export type Submission = {
  id: number;
  user: string;
  course: string;
  taskid: number;
  timestamp: number;
  content: string;
  resultType: string;
  simplified: {
    compiler?: {
      stdout: string;
      exitCode: number;
    };
    testCase?: {
      message?: string;
      stdin?: string;
      stdout?: string;
      expectedStdout?: string;
      exitCode: number;
    };
  };
  details: {
    error: string;
  };
  score: number;
};

export type SubmissionRow = Submission;
