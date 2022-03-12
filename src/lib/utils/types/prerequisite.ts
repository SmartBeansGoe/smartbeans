import type { Progress } from './progress';
import * as yup from 'yup';

export const schemaCondition = yup.lazy((val) =>
  Array.isArray(val) ? yup.array().of(yup.number()) : yup.number()
);
export type Condition = yup.InferType<typeof schemaCondition>;

interface PrerequisiteInterface {
  conditions: Condition[];
  check: (progress: Progress) => boolean;
}

export class Prerequisite implements PrerequisiteInterface {
  conditions: Condition[];
  constructor(conditions: Condition[]) {
    conditions.forEach((c) => schemaCondition.validateSync(c));
    this.conditions = conditions;
  }

  check(progress: Progress) {
    if (this.conditions.length === 0) return true;

    return this.conditions
      .map((condition) => {
        if (Array.isArray(condition)) {
          if (condition.length == 0) return true;
          return condition
            .map((p) => progress.includes(p))
            .reduce((previous, current) => previous || current);
        } else {
          return progress.includes(condition);
        }
      })
      .reduce((previous, current) => previous && current);
  }
}
