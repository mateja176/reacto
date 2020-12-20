import * as gql from 'graphql';
import ts from 'typescript';
import { mapPrimitive } from './generateTs';

describe('generate Typescript type from Graphql SDL', () => {
  describe('map scalars to primitives', () => {
    test('should map to string', () => {
      const result = mapPrimitive(gql.GraphQLString);
      expect(result.kind).toBe(ts.SyntaxKind.StringKeyword);
    });
    test('should map int to number', () => {
      const result = mapPrimitive(gql.GraphQLInt);
      expect(result.kind).toBe(ts.SyntaxKind.NumberKeyword);
    });
    test('should map float to number', () => {
      const result = mapPrimitive(gql.GraphQLFloat);
      expect(result.kind).toBe(ts.SyntaxKind.NumberKeyword);
    });
    test('should map to boolean', () => {
      const result = mapPrimitive(gql.GraphQLBoolean);
      expect(result.kind).toBe(ts.SyntaxKind.BooleanKeyword);
    });
  });
});
