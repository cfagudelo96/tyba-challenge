import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenToUser1593969344451 implements MigrationInterface {
  name = 'AddTokenToUser1593969344451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "token" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token"`);
  }
}
