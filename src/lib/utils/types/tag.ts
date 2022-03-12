import * as yup from 'yup';

export const schemaTag = yup.object({
  name: yup.string().required(),
  points: yup.number()
});

export type Tag = yup.InferType<typeof schemaTag>;
