import * as fs from 'fs-extra';
import * as gql from 'graphql';
import { join } from 'path';
import prettier from 'prettier';
import ts from 'typescript';
import prettierOptions from '../.prettierrc.json';

const generatedPath = join(__dirname, '..', 'src', 'generated');

(async () => {
  const types = Object.values(
    gql
      .buildSchema(
        await fs.readFile(join(generatedPath, 'schema.graphql'), {
          encoding: 'utf-8',
        }),
      )
      .getTypeMap(),
  ).filter((type) => !gql.isScalarType(type) && !!type.name.startsWith('__'));

  const tsTypes = types.map((type) => {
    if (gql.isInterfaceType(type)) {
      return ts.factory.createInterfaceDeclaration(
        [],
        [],
        type.name,
        [],
        [],
        Object.entries(type.getFields()).map(([name, fieldType]) =>
          ts.factory.createPropertySignature(
            [],
            name,
            undefined,
            // TODO
            ts.factory.createFunctionTypeNode(
              [],
              [],
              ts.factory.createTypeReferenceNode('Test'),
            ),
          ),
        ),
      );
    } else {
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
      ts.factory.createExportSpecifier(undefined, 'Test'),
    ]),
  );

  const prog = ts.factory.createNodeArray([
    importDeclaration,
    ...tsTypes.filter((type): type is ts.InterfaceDeclaration => !!type),
    exportDeclaration,
  ]);

  const printer = ts.createPrinter();

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
