import { schemaCondition } from './prerequisite';
import { schemaTag } from './tag';
import * as yup from 'yup';

export const schemaTaskDescription = yup.object({
  defaultEditorInput: yup.string().defined(),
  shortname: yup.string().required(),
  task: yup.string().required(),
  title: yup.string().required()
});
export type TaskDescription = yup.InferType<typeof schemaTaskDescription>;

export const schemaTask = yup.object({
  taskid: yup.number().required(),
  taskDescription: schemaTaskDescription.required(),
  lang: yup.string().required()
});
export type Task = yup.InferType<typeof schemaTask>;

export const schemaTest = yup.object({
  testtype: yup.string().required(),
  testCases: yup.array().of(yup.mixed()).required()
});

export const schemaTaskRow = schemaTask.concat(
  yup.object({
    solution: yup.string().required(),
    tests: yup.array(schemaTest).required()
  })
);
export type TaskRow = yup.InferType<typeof schemaTaskRow>;

export const schemaCourseTaskMetaData = yup.object({
  course: yup.string().required(),
  tags: yup.array(schemaTag).required(),
  orderBy: yup.number().required(),
  prerequisites: yup.array(schemaCondition).required()
});
export type CourseTaskMetaData = yup.InferType<typeof schemaCourseTaskMetaData>;

export const schemaCourseTaskRow = schemaCourseTaskMetaData.concat(
  yup.object({
    taskid: yup.number().required()
  })
);
export type CourseTaskRow = yup.InferType<typeof schemaCourseTaskRow>;

export const schemaTaskPost = schemaTaskRow.concat(
  yup.object({
    courseMetaData: yup.array(schemaCourseTaskMetaData).required()
  })
);
export type TaskPost = yup.InferType<typeof schemaTaskPost>;

export const schemaCourseTask = schemaTask.concat(schemaCourseTaskMetaData);
export type CourseTask = yup.InferType<typeof schemaCourseTask>;

export type TaskLanguage = 'c' | 'python' | 'java' | 'plaintext';
export type TaskFileEnd = '.c' | '.py' | '.java' | '.txt';
