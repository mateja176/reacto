import { DocumentType } from '@typegoose/typegoose';

interface Class {
  _id: string;
}
export const mapDocument = <C extends Class>(
  doc: DocumentType<C>,
): Omit<C, '_id'> & { id: C['_id'] } => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, ...cls } = doc.toJSON();
  return { ...cls, id: _id };
};
