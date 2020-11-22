import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';

export class AddUserRole1606078148664 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    await queryRunner.updateMany('user', {}, { $set: { role: 'regular' } });
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {
    await queryRunner.updateMany('user', {}, { $unset: { role: null } });
  }
}
