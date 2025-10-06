import { config } from 'dotenv';
import AppDataSource from '../config/database';

// Ensure environment variables are loaded when running this script standalone
config();

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to DB');

    // Load applied migrations from DB
    const appliedRows: Array<{ name: string }> = await AppDataSource.query(`SELECT name FROM migrations`);
    const applied = new Set(appliedRows.map(r => r.name));

    // Iterate migrations defined in the DataSource and apply missing ones one-by-one.
    const migrations = AppDataSource.migrations || [];
    if (migrations.length === 0) {
      console.log('No migrations found in DataSource.');
      await AppDataSource.destroy();
      process.exit(0);
    }

    for (const mig of migrations) {
      const name = (mig as any).name || (mig.constructor && mig.constructor.name);
      if (applied.has(name)) {
        console.log(`Skipping already applied migration: ${name}`);
        continue;
      }

      console.log(`Applying migration: ${name}`);
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // Execute migration 'up' handler
        if (typeof (mig as any).up === 'function') {
          await (mig as any).up(queryRunner);
        } else if (typeof (mig as any).instance?.up === 'function') {
          await (mig as any).instance.up(queryRunner);
        } else {
          throw new Error(`Migration ${name} has no up() method`);
        }

        await queryRunner.commitTransaction();

        // record migration as applied
        await AppDataSource.query(`INSERT INTO migrations (timestamp, name) VALUES ($1, $2)`, [Date.now(), name]);
        console.log(`Migration applied: ${name}`);
      } catch (innerErr: any) {
        await queryRunner.rollbackTransaction();

        const driverErr = innerErr?.driverError || innerErr;
        const isAlreadyExists =
          driverErr?.code === '42710' ||
          (typeof driverErr?.message === 'string' && driverErr.message.includes('already exists')) ||
          (typeof innerErr?.message === 'string' && innerErr.message.includes('already exists'));

        if (isAlreadyExists) {
          console.warn(`Warning: migration ${name} encountered existing DB objects. Marking as applied.`);
          // mark as applied to avoid future attempts
          try {
            await AppDataSource.query(`INSERT INTO migrations (timestamp, name) VALUES ($1, $2)`, [Date.now(), name]);
          } catch (insertErr) {
            console.warn(`Failed to mark migration ${name} as applied:`, (insertErr && (insertErr as any).message) || String(insertErr));
          }
        } else {
          throw innerErr;
        }
      } finally {
        await queryRunner.release();
      }
    }

    console.log('All migrations processed');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Migration error', (err && (err as any).message) || String(err));
    process.exit(1);
  }
}

run();
