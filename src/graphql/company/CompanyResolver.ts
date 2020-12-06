import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Role } from '../../entities/User/User';
import { Context } from '../../interfaces/Context';
import { CompanyModel } from '../../services/models';
import { NotFoundError } from '../../utils/errors';
import { CompanyOutput } from './types';

@Resolver()
export class CompanyResolver {
  @Query(() => CompanyOutput)
  @Authorized(Role.admin)
  async company(@Arg('id') id: string, @Ctx() context: Context) {
    const company = await CompanyModel.findById(id);

    if (
      company &&
      [Role.admin].includes(context.user.role) &&
      context.user.company.id === company._id
    ) {
      return { ...company, id: company._id };
    } else {
      throw new NotFoundError(id);
    }
  }
}
