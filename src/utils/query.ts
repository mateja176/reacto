import { DocumentType, Ref, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { Node } from '../generated/graphql';
import { NotFoundError } from './errors';

export const createFind = <C>(
  Model: ReturnModelType<AnyParamConstructor<C>>,
) => <N extends Node>(map: (cls: DocumentType<C>) => N) => (
  ref: Ref<C>,
) => async () => {
  const doc = await Model.findById(ref);
  if (!doc) {
    throw new NotFoundError();
  }

  return map(doc);
};
export const createFindMany = <C>(
  Model: ReturnModelType<AnyParamConstructor<C>>,
) => <N extends Node>(map: (cls: DocumentType<C>) => N) => (
  refs: Ref<C>[],
) => async () => {
  // * reference https://stackoverflow.com/questions/32264225/how-to-get-multiple-document-using-array-of-mongodb-id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docs = await Model.find({ _id: { $in: refs } } as any);

  return docs.map(map);
};
