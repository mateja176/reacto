import { DocumentType } from '@typegoose/typegoose';
import { Class } from '../interfaces/Class';

export type MapClass<C extends Class> = Omit<C, '_id'> & { id: C['_id'] };
export const mapDoc = <C extends Class>(doc: DocumentType<C>): MapClass<C> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, ...cls } = doc.toJSON();
  return { ...cls, id: _id };
};
