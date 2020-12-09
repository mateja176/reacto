import * as fs from 'fs';
import { join } from 'path';
import prettier from 'prettier';
import ts from 'typescript';
import prettierOptions from '../.prettierrc.json';

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
  join(__dirname, '..', 'src', 'generated', 'graphql.ts'),
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
