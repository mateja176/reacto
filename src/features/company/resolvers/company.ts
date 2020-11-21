import { Company, QueryResolvers } from '../../../generated/graphql';

const company: QueryResolvers['company'] = (): Company => ({
  id: '1',
  name: 'Acme',
});

export default company;
