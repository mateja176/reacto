import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import * as fs from 'fs-extra';
import { print } from 'graphql';
import { join } from 'path';

const srcPath = join(__dirname, '..', 'src');

const typesArray = loadFilesSync(join(srcPath, 'graphql'));

const documentNode = mergeTypeDefs(typesArray);

const stringSchema = print(documentNode);

(async () => {
  await fs.writeFile(
    join(srcPath, 'generated', 'schema.graphql'),
    stringSchema,
  );
})();
