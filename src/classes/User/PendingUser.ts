import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { CompanyClass } from '../Company/Company';
import { Role } from './User';

@ModelOptions({ options: { customName: 'PendingUser' } })
export class PendingUserClass {
  @prop({ unique: true })
  email: string;
  @prop({ enum: Role })
  role: Role;
  @prop({ ref: () => CompanyClass })
  company: Ref<CompanyClass>;
}
