import * as yup from 'yup';

export const schemaCourseConfig = yup.object().shape({
  gamification: yup
    .object({
      achievements: yup
        .object({
          active: yup.boolean().required()
        })
        .required(),
      avatar: yup
        .object({
          active: yup.boolean().required()
        })
        .required(),
      leaderboard: yup
        .object({
          active: yup.boolean().required()
        })
        .required(),
      level: yup
        .object({
          points: yup
            .object({
              active: yup.boolean().required(),
              unitName: yup.string().required(),
              levels: yup.array().of(yup.number())
            })
            .required(),
          tasks: yup
            .object({
              active: yup.boolean().required(),
              unitName: yup.string().required()
            })
            .required()
        })
        .required(),
      skillgraph: yup
        .object({
          active: yup.boolean().required()
        })
        .required()
    })
    .required(),
  tasks: yup
    .object({
      editor: yup.boolean().required(),
      nextExercise: yup
        .object({
          dashboard: yup
            .object({
              active: yup.boolean().required()
            })
            .required()
        })
        .required(),
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
