import { mergeTypeDefs } from '@graphql-tools/merge';
import { promises as fs } from 'fs';
import { print } from 'graphql';
import { join } from 'path';

const srcPath = join(__dirname, '..', 'src');

const loadFiles = async (path: string): Promise<string> => {
  const items = await fs.readdir(path, { withFileTypes: true });

  const files = await Promise.all(
    items.map((item) => {
      if (item.isDirectory()) {
        return loadFiles(join(path, item.name));
      } else if (item.name.endsWith('.graphql')) {
        return fs.readFile(join(path, item.name), { encoding: 'utf-8' });
      } else {
        return '';
      }
    }),
  );

  return files.reduce(
    (accumulation, content) => accumulation.concat(content),
    '',
  );
};

(async () => {
  const typesArray = await loadFiles(join(srcPath, 'graphql'));

  const documentNode = mergeTypeDefs([typesArray]);

  const stringSchema = print(documentNode);

  await fs.writeFile(
    join(srcPath, 'generated', 'schema.graphql'),
    stringSchema,
  );
})();
