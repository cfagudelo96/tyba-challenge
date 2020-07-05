import * as dotenv from 'dotenv';
import * as fs from 'fs';

let envConfig: { [key: string]: string };

envConfig = process.env;

try {
  envConfig = { ...envConfig, ...dotenv.parse(fs.readFileSync('.env')) };
} catch (error) {
  console.error(
    'An error happened loading the environment for the ORM:',
    error,
  );
}

export = {
  type: 'postgres',
  url: envConfig.DATABASE_URL,
  entities: ['src/**/**.entity{.ts,.js}'],
  migrations: ['migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'migrations',
  },
};
