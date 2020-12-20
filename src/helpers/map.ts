import { DocumentType } from '@typegoose/typegoose';
import { Role, UserClass } from '../classes/User/User';
import { AdminRole, RegularRole } from '../generated/graphql';
import { JWTUser } from '../interfaces/JWTUser';

export const userDocToJWTUser = (
  userDoc: DocumentType<UserClass>,
): JWTUser => ({
  id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  company: { id: String(userDoc.company) },
  role: userDoc.role === Role.admin ? AdminRole.admin : RegularRole.regular,
});
