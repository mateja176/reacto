import { gql } from 'apollo-server-express';
import { promises as fs, Stats } from 'fs';
import { DocumentNode } from 'graphql';
import { join } from 'path';
import { and, not, pipe } from 'ramda';

const getStat = ([, b]: readonly [string, Stats]): Stats => b;
export const readSchemas = async (
  rootPath: string,
): Promise<DocumentNode[]> => {
  const paths = await fs.readdir(rootPath);

  const pairs = await Promise.all(
    paths.map((path) => {
      const parentPath = join(rootPath, path);
      return fs.lstat(parentPath).then((stat) => [parentPath, stat] as const);
    }),
  );

  const isDir = (stat: Stats) => stat.isDirectory();
  const filter = pipe(getStat, isDir);

  const dirs = pairs.filter(filter);

  const graphqlFiles = await Promise.all(
    pairs
      .filter((file) =>
        and(pipe(filter, not)(file))(file[0].endsWith('.graphql')),
      )
      .map(([path]) =>
        fs.readFile(path, { encoding: 'utf-8' }).then((file) => gql(file)),
      ),
  );

  const nestedFiles = await Promise.all(dirs.map(([dir]) => readSchemas(dir)));

  return graphqlFiles.concat(nestedFiles.flat());
};
