import * as fs from 'fs-extra';
import * as gql from 'graphql';
import { join } from 'path';
import prettier from 'prettier';
import ts from 'typescript';
import prettierOptions from '../.prettierrc.json';
import {
  helperTypes,
  mapEnum,
  mapInterfaceOrEnum,
  mapObject,
  mapUnion,
} from '../src/helpers/generateTs';

const resolversName = 'Resolvers';
const queryName = 'Query';
const mutationName = 'Mutation';

const srcPath = join(__dirname, '..', 'src');
const generatedPath = join(srcPath, 'generated');

const printer = ts.createPrinter();

(async () => {
  const types = Object.values(
    gql
      .buildSchema(
        await fs.readFile(join(generatedPath, 'schema.graphql'), {
          encoding: 'utf-8',
        }),
      )
      .getTypeMap(),
  ).filter((type) => !gql.isScalarType(type) && !type.name.startsWith('__'));

  const tsTypes = types.map((type) => {
    if (gql.isInterfaceType(type) || gql.isInputObjectType(type)) {
      return mapInterfaceOrEnum(type);
    } else if (gql.isObjectType(type)) {
      return mapObject(type);
    } else if (gql.isEnumType(type)) {
      return mapEnum(type);
    } else if (gql.isUnionType(type)) {
      return mapUnion(type);
    } else {
      throw new Error(
        `Could not map type "${type.name} as it is neither an interface, type, enum, union or input."`,
      );
    }
  });

  const infoImport = ts.factory.createImportDeclaration(
    [],
    [],
    ts.factory.createImportClause(
      true,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          undefined,
          ts.factory.createIdentifier('GraphQLResolveInfo'),
        ),
      ]),
    ),
    ts.factory.createStringLiteral('graphql'),
  );
  const contextImport = ts.factory.createImportDeclaration(
    [],
    [],
    ts.factory.createImportClause(
      true,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          undefined,
          ts.factory.createIdentifier('Context'),
        ),
      ]),
    ),
    ts.factory.createStringLiteral(join('..', 'Context')),
  );
  const imports = [infoImport, contextImport];

  const exportDeclaration = ts.factory.createExportDeclaration(
    [],
    [],
    true,
    ts.factory.createNamedExports([
      ...helperTypes.map((type) =>
        ts.factory.createExportSpecifier(undefined, type.name),
      ),
      ...tsTypes.map((type) =>
        ts.factory.createExportSpecifier(undefined, type.name),
      ),
      ts.factory.createExportSpecifier(undefined, resolversName),
    ]),
  );

  const prog = ts.factory.createNodeArray([
    ...imports,
    ...helperTypes,
    ...tsTypes,
    ts.factory.createInterfaceDeclaration(
      [],
      [],
      resolversName,
      [],
      undefined,
      [
        ts.factory.createPropertySignature(
          [],
          queryName,
          undefined,
          ts.factory.createTypeReferenceNode(queryName),
        ),
        ts.factory.createPropertySignature(
          [],
          mutationName,
          undefined,
          ts.factory.createTypeReferenceNode(mutationName),
        ),
      ],
    ),
    exportDeclaration,
  ]);

  const source = printer.printList(
    ts.ListFormat.None,
    prog,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest),
  );

  fs.writeFile(
    join(generatedPath, 'graphql.ts'),
    prettier.format(source, {
      parser: 'typescript',
      ...(prettierOptions as prettier.Options),
    }),
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
})();
