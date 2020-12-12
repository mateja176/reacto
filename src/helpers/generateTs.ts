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
  type:
    | gql.GraphQLInterfaceType
    | gql.GraphQLObjectType
    | gql.GraphQLInputObjectType,
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
        mapTypeReference(fieldType),
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

const createType = (isNullable: boolean) => (type: ts.TypeNode) =>
  isNullable ? createMaybeType(type) : type;

const mapTypeReference = (fieldType: gql.GraphQLField<unknown, unknown>) => {
  const [type, isNullable] = gql.isNonNullType(fieldType.type)
    ? [gql.getNullableType(fieldType.type), false]
    : [fieldType.type, true];

  const createTypeReference = createType(isNullable);
  if (gql.isScalarType(type)) {
    return createTypeReference(mapPrimitive(type));
  } else if (gql.isEnumType(type)) {
    return createTypeReference(mapEnumReference(type));
  } else {
    return mapReferenceFactory(type, isNullable);
  }
};

// * reference https://graphql.org/learn/schema/#scalar-types
export const mapPrimitive = (
  type: gql.GraphQLScalarType,
): ts.KeywordTypeNode | ts.TypeReferenceType => {
  if (gql.isEqualType(type, gql.GraphQLID)) {
    return ts.factory.createTypeReferenceNode('ID');
  } else if (gql.isEqualType(type, gql.GraphQLString)) {
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

export const mapEnumReference = (
  type: gql.GraphQLEnumType,
): ts.TypeReferenceType => ts.factory.createTypeReferenceNode(type.name);

export const mapReferenceFactory = (
  type:
    | gql.GraphQLList<gql.GraphQLType>
    | gql.GraphQLInterfaceType
    | gql.GraphQLUnionType
    | gql.GraphQLObjectType,
  isNullable: boolean = false,
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

    return createFactory(isNullable ? createMaybeType(typedArray) : typedArray);
  } else {
    return createFactory(
      isNullable
        ? createMaybeType(ts.factory.createTypeReferenceNode(type.name))
        : ts.factory.createTypeReferenceNode(type.name),
    );
  }
};
export const createFactory = (type: ts.TypeNode): ts.FunctionTypeNode => {
  return ts.factory.createFunctionTypeNode([], [], type);
};
