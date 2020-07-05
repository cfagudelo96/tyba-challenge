import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransactions1593972095113 implements MigrationInterface {
  name = 'AddTransactions1593972095113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" (
        "id" SERIAL NOT NULL,
        "url" character varying NOT NULL,
        "operation" character varying NOT NULL,
        "userId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
