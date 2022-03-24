import * as yup from 'yup';

export const schemaAssetUnlocked = yup.object().shape({
  assetId: yup.string().required(),
  user: yup.string().required()
});
export type AssetUnlocked = yup.InferType<typeof schemaAssetUnlocked>;
export type AssetUnlockedRow = AssetUnlocked;

export const schemaAsset = yup.object().shape({
  id: yup.string().required(),
  outfitId: yup.string().required().max(255),
  type: yup.string().oneOf(['hat', 'pants', 'shirt']).max(255),
  name: yup.string().required().max(255),
  details: yup.object().default({}).required()
});

export type Asset = yup.InferType<typeof schemaAsset>;

export type AssetRow = Asset;
