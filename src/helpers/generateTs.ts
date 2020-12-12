import * as gql from 'graphql';
import ts from 'typescript';
import { Context } from '../Context';

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

export const mapInterfaceOrEnum = (
  type: gql.GraphQLInterfaceType | gql.GraphQLInputObjectType,
): ts.InterfaceDeclaration =>
  ts.factory.createInterfaceDeclaration(
    [],
    [],
    type.name,
    [],
    [],
    Object.values(type.getFields()).map((fieldType: gql.GraphQLInputField) =>
      ts.factory.createPropertySignature(
        [],
        fieldType.name,
        undefined,
        mapInput(fieldType.type),
      ),
    ),
  );

export const mapObject = (
  type: gql.GraphQLObjectType,
): ts.InterfaceDeclaration =>
  ts.factory.createInterfaceDeclaration(
    [],
    [],
    type.name,
    [],
    [],
    Object.values(
      type.getFields(),
    ).map((fieldType: gql.GraphQLField<unknown, Context>) =>
      ts.factory.createPropertySignature(
        [],
        fieldType.name,
        undefined,
        fieldType.args.length === 0
          ? mapFactory(fieldType.type)
          : ts.factory.createFunctionTypeNode(
              [],
              [
                ts.factory.createParameterDeclaration(
                  [],
                  [],
                  undefined,
                  'source',
                  undefined,
                  ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
                ),
                ts.factory.createParameterDeclaration(
                  [],
                  [],
                  undefined,
                  'args',
                  undefined,
                  ts.factory.createTypeLiteralNode(
                    fieldType.args.map((arg) =>
                      ts.factory.createPropertySignature(
                        [],
                        arg.name,
                        undefined,
                        mapInput(arg.type),
                      ),
                    ),
                  ),
                ),
                ts.factory.createParameterDeclaration(
                  [],
                  [],
                  undefined,
                  'context',
                  undefined,
                  ts.factory.createTypeReferenceNode('Context'),
                ),
                ts.factory.createParameterDeclaration(
                  [],
                  [],
                  undefined,
                  'info',
                  undefined,
                  ts.factory.createTypeReferenceNode('GraphQLResolveInfo'),
                ),
              ],
              ts.factory.createExpressionWithTypeArguments(
                ts.factory.createIdentifier('Promise'),
                [mapInput(fieldType.type)],
              ),
            ),
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

export const mapUnion = (type: gql.GraphQLUnionType): ts.TypeAliasDeclaration =>
  ts.factory.createTypeAliasDeclaration(
    [],
    [],
    type.name,
    [],
    ts.factory.createUnionTypeNode(
      type
        .getTypes()
        .map((subtype) => ts.factory.createTypeReferenceNode(subtype.name)),
    ),
  );

const createMaybeNullableType = (isNullable: boolean) => (type: ts.TypeNode) =>
  isNullable ? createMaybeType(type) : type;

type ReferenceType =
  | gql.GraphQLList<gql.GraphQLType>
  | gql.GraphQLInterfaceType
  | gql.GraphQLUnionType
  | gql.GraphQLInputObjectType
  | gql.GraphQLObjectType;

const mapType = (
  mapVectorType: (reference: ReferenceType, isNullable: boolean) => ts.TypeNode,
) => (
  typeNode: gql.GraphQLScalarType | gql.GraphQLEnumType | ReferenceType,
) => {
  const [type, isNullable] = gql.isNonNullType(typeNode)
    ? [gql.getNullableType(typeNode), false]
    : [typeNode, true];

  const createType = createMaybeNullableType(isNullable);
  if (gql.isScalarType(type)) {
    return createType(mapPrimitive(type));
  } else if (gql.isEnumType(type)) {
    return createType(mapEnumReference(type));
  } else {
    return mapVectorType(type, isNullable);
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

export const mapReference = (transform: (type: ts.TypeNode) => ts.TypeNode) => (
  type: ReferenceType,
  isNullable: boolean = false,
) => {
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

    return transform(isNullable ? createMaybeType(typedArray) : typedArray);
  } else {
    return transform(
      isNullable
        ? createMaybeType(ts.factory.createTypeReferenceNode(type.name))
        : ts.factory.createTypeReferenceNode(type.name),
    );
  }
};
export const createFactory = (type: ts.TypeNode): ts.FunctionTypeNode => {
  return ts.factory.createFunctionTypeNode(
    [],
    [],
    ts.factory.createExpressionWithTypeArguments(
      ts.factory.createIdentifier('Promise'),
      [type],
    ),
  );
};

const mapIdentityReference = mapReference((a) => a);
const mapFactoryReference = mapReference(createFactory);

const mapInput = mapType(mapIdentityReference);
const mapFactory = mapType(mapFactoryReference);
