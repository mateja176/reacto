import * as gql from 'graphql';
import ts from 'typescript';

const MaybeType = ts.factory.createTypeAliasDeclaration(
  [],
  [],
  'Maybe',
  [ts.factory.createTypeParameterDeclaration('A')],
  ts.factory.createUnionTypeNode([
    ts.factory.createTypeReferenceNode('A'),
    ts.factory.createKeywordTypeNode(
      ts.SyntaxKind.NullKeyword as ts.KeywordTypeSyntaxKind,
    ),
  ]),
);
const createMaybeType = (type: ts.TypeNode) =>
  ts.factory.createExpressionWithTypeArguments(
    ts.factory.createIdentifier('Maybe'),
    [type],
  );

const IDType = ts.factory.createTypeAliasDeclaration(
  [],
  [],
  'ID',
  [],
  ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
);

export const helperTypes = [MaybeType, IDType];

export const mapInterface = (
  type: gql.GraphQLInterfaceType | gql.GraphQLObjectType,
): ts.InterfaceDeclaration =>
  ts.factory.createInterfaceDeclaration(
    [],
    [],
    type.name,
    [],
    [],
    Object.values(type.getFields()).map((fieldType) =>
      ts.factory.createPropertySignature(
        [],
        fieldType.name,
        undefined,
        mapTypeNode(fieldType),
      ),
    ),
  );

export const mapEnum = (type: gql.GraphQLEnumType): ts.EnumDeclaration =>
  ts.factory.createEnumDeclaration(
    [],
    [],
    type.name,
    type
      .getValues()
      .map((value) => value.name)
      .map((name) =>
        ts.factory.createEnumMember(name, ts.factory.createStringLiteral(name)),
      ),
  );

const mapTypeNode = (fieldType: gql.GraphQLField<unknown, unknown>) => {
  const type = fieldType.type;
  if (gql.isNonNullType(type)) {
    const nullableType = gql.getNullableType(type);
    return gql.isScalarType(nullableType)
      ? mapPrimitive(nullableType)
      : mapVectorFactory(nullableType);
  } else {
    return gql.isScalarType(type)
      ? createMaybeType(mapPrimitive(type))
      : mapVectorFactory(type, true);
  }
};

// * reference https://graphql.org/learn/schema/#scalar-types
export const mapPrimitive = (
  type: gql.GraphQLScalarType,
): ts.KeywordTypeNode => {
  if (
    gql.isEqualType(type, gql.GraphQLString) ||
    gql.isEqualType(type, gql.GraphQLID)
  ) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
  } else if (
    gql.isEqualType(type, gql.GraphQLInt) ||
    gql.isEqualType(type, gql.GraphQLFloat)
  ) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
  } else {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
  }
};

export const mapVectorFactory = (
  type:
    | gql.GraphQLList<gql.GraphQLType>
    | gql.GraphQLInterfaceType
    | gql.GraphQLUnionType
    | gql.GraphQLEnumType
    | gql.GraphQLObjectType,
  maybe: boolean = false,
): ts.FunctionTypeNode => {
  if (gql.isListType(type)) {
    const ofType = type.ofType.toString();

    const typedArray = (() => {
      if (ofType.endsWith('!')) {
        const subType = ofType.slice(0, -1);

        return ts.factory.createArrayTypeNode(
          ts.factory.createTypeReferenceNode(subType),
        );
      } else {
        const maybeSubType = ofType;

        return ts.factory.createArrayTypeNode(
          createMaybeType(ts.factory.createTypeReferenceNode(maybeSubType)),
        );
      }
    })();

    return createFactory(maybe ? createMaybeType(typedArray) : typedArray);
  } else {
    return createFactory(
      maybe
        ? createMaybeType(ts.factory.createTypeReferenceNode(type.name))
        : ts.factory.createTypeReferenceNode(type.name),
    );
  }
};
export const createFactory = (type: ts.TypeNode): ts.FunctionTypeNode => {
  return ts.factory.createFunctionTypeNode([], [], type);
};
