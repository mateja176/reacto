import { DocumentType, mongoose } from '@typegoose/typegoose';

//* https://stackoverflow.com/questions/12495891/what-is-the-v-field-in-mongoose
export type MapClass<C> = C & { id: string };
export const mapDoc = <C>(doc: DocumentType<C>): MapClass<C> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, ...cls } = doc.toJSON();
  return { ...cls, id: _id };
};

export const docToId = ({ _id }: { _id: mongoose.Types.ObjectId }) => _id;
