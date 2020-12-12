import * as fs from 'fs-extra';
import * as gql from 'graphql';
import { join } from 'path';
import prettier from 'prettier';
import ts from 'typescript';
import prettierOptions from '../.prettierrc.json';
import { helperTypes, mapEnum, mapInterface } from '../src/helpers/generateTs';

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
    if (gql.isInterfaceType(type)) {
      return mapInterface(type);
    } else if (gql.isObjectType(type)) {
      return mapInterface(type);
    } else if (gql.isEnumType(type)) {
      return mapEnum(type);
    } else if (gql.isInputObjectType(type)) {
      return mapInterface(type);
    } else {
      throw new Error(
        `Could not map type "${type.name} as it is neither an interact, type, enum or input."`,
      );
    }
  });

  const importDeclaration = ts.factory.createImportDeclaration(
    [],
    [],
    ts.factory.createImportClause(
      true,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          undefined,
          ts.factory.createIdentifier('IResolverObject'),
        ),
      ]),
    ),
    ts.factory.createStringLiteral('apollo-server-express'),
  );

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
    ]),
  );

  const prog = ts.factory.createNodeArray([
    importDeclaration,
    ...helperTypes,
    ...tsTypes,
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
