import * as fs from 'fs-extra';
import { buildSchema } from 'graphql';
import { join } from 'path';
import prettier from 'prettier';
import ts from 'typescript';
import prettierOptions from '../.prettierrc.json';

const generatedPath = join(__dirname, '..', 'src', 'generated');

(async () => {
  const types = Object.entries(
    buildSchema(
      await fs.readFile(join(generatedPath, 'schema.graphql'), {
        encoding: 'utf-8',
      }),
    ).getTypeMap(),
  );
  console.log(types);

  const importClause = ts.factory.createImportDeclaration(
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

  const interfaceDeclaration = ts.factory.createInterfaceDeclaration(
    [],
    [],
    'Test',
    [],
    [],
    [
      ts.factory.createPropertySignature(
        [],
        'a',
        undefined,
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ),
      ts.factory.createPropertySignature(
        [],
        'b',
        undefined,
        ts.factory.createFunctionTypeNode(
          [],
          [],
          ts.factory.createTypeReferenceNode('Test'),
        ),
      ),
    ],
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
    importClause,
    interfaceDeclaration,
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
