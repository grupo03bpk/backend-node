import { config } from 'dotenv';
import AppDataSource from '../config/database';

// Ensure environment variables are loaded when running this script standalone
config();

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to DB');

    // Check if there are pending migrations
    const hasPending = await AppDataSource.showMigrations();
    if (!hasPending) {
      console.log('No pending migrations.');
      await AppDataSource.destroy();
      process.exit(0);
    }

    console.log('Pending migrations found. Running migrations...');
    try {
      await AppDataSource.runMigrations();
      console.log('Migrations finished');
    } catch (innerErr: any) {
      // If migration fails because a DB object already exists, warn and continue in dev
      const driverErr = innerErr?.driverError || innerErr;
      const isAlreadyExists =
        driverErr?.code === '42710' || // Postgres: duplicate_object / type exists
        (typeof driverErr?.message === 'string' && driverErr.message.includes('already exists')) ||
        (typeof innerErr?.message === 'string' && innerErr.message.includes('already exists'));

      if (isAlreadyExists) {
        console.warn('Warning: migration encountered existing DB objects (already exists).');
        console.warn('This may happen if the DB has partial schema. Please inspect the DB.');
      } else {
        throw innerErr;
      }
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Migration error', err);
    // In CI/production we'd want to fail; but keep non-zero exit so callers can detect
    process.exit(1);
  }
}

run();
