import { DocumentType } from '@typegoose/typegoose';

//* https://stackoverflow.com/questions/12495891/what-is-the-v-field-in-mongoose
export type MapClass<C> = Omit<C, '_id' | '__v'> & { id: string };
export const mapDoc = <C>(doc: DocumentType<C>): MapClass<C> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, ...cls } = doc.toJSON();
  return { ...cls, id: _id };
};
