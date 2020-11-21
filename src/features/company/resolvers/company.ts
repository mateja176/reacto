import { Company, QueryResolvers } from '../../../generated/graphql';

const company: QueryResolvers['company'] = (): Company => ({
  id: '1',
  name: 'Test',
});

export default company;
