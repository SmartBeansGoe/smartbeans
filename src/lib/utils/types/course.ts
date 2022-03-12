import * as yup from 'yup';

export type LevelUnitType = 'tasks' | 'points';
export const schemaCourseConfig = yup.object().shape({
  gamification: yup
    .object({
      achievements: yup
        .object({
          onDashboard: yup.boolean().required()
        })
        .default(null)
        .nullable(),
      avatar: yup
        .object({
          onDashboard: yup.boolean().required()
        })
        .default(null)
        .nullable(),
      leaderboard: yup
        .object({
          onDashboard: yup.boolean().required()
        })
        .default(null)
        .nullable(),
      level: yup
        .object({
          onDashboard: yup.boolean().required(),
          unitName: yup.string().required(),
          unit: yup.mixed<LevelUnitType>().oneOf(['tasks', 'points'])
        })
        .default(null)
        .nullable(),
      skillgraph: yup
        .object({
          onDashboard: yup.boolean().required()
        })
        .default(null)
        .nullable()
    })
    .required(),
  tasks: yup
    .object({
      editor: yup.boolean().required(),
      unfulfilledPrerequisites: yup
        .object({
          blockedTaskByUnfulfilledPrerequisites: yup.boolean().required(),
          grayedOutTaskByUnfulfilledPrerequisites: yup.boolean().required()
        })
        .required(),
      standardView: yup
        .object({
          title: yup.string().required(),
          categorizeByTags: yup.array<String>().required()
        })
        .default(null)
        .nullable(),
      complexView: yup
        .object({
          title: yup.string().required()
        })
        .default(null)
        .nullable()
    })
    .required()
});
export type CourseConfig = yup.InferType<typeof schemaCourseConfig>;

export const schemaCourse = yup.object({
  name: yup.string().required(),
  title: yup.string().required(),
  config: schemaCourseConfig
});
export type Course = yup.InferType<typeof schemaCourse>;
export type CourseRow = Course;

export type CourseMappingRow = {
  courseName: string;
  studipId: string;
};
// {
//   "gamification": {
//     "avatar": {
//       "onDashboard": true
//     },
//     "level": {
//       "onDashboard": false,
//       "unit": "tasks",
//       "unitName": "Aufgaben"
//     }
//   },
//   "tasks": {
//     "blockedTaskByUnfulfilledPrerequisites": false,
//     "editor": false,
//     "standardView": {
//       "categorizeByTags": ["einfach", "mittel", "schwer"],
//       "title": "Aufgaben"
//     }
//   }
// }
