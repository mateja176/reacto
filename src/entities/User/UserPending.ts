import { prop, Ref } from '@typegoose/typegoose';
import { Company } from '../Company/Company';
import { Role } from './User';

export class UserPending {
  @prop()
  public _id: string;
  @prop({ unique: true })
  email: string;
  @prop({ enum: Role })
  role: Role;
  @prop({ ref: Company })
  company: Ref<Company>;
}
