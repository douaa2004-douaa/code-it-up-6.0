const fs   = require('fs');
const path = require('path');
const { query } = require('./pool');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log('Running migrations...');

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(migrationsDir, files[i]);
    const sql = fs.readFileSync(filePath, 'utf8');
    await query(sql);
    console.log(`  Migration ${i + 1}/${files.length} done`);
  }

  console.log('All migrations complete.');
}

module.exports = { runMigrations };
