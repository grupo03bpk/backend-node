import AppDataSource from '../config/database';

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to DB, running migrations...');
    await AppDataSource.runMigrations();
    console.log('Migrations finished');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Migration error', err);
    process.exit(1);
  }
}

run();
