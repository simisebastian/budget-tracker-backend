const pool = require('./db');

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS income_sources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS income (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        source_id INTEGER REFERENCES income_sources(id),
        amount NUMERIC NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS expenses_sub_sources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )`);

    await client.query(`
        CREATE TABLE IF NOT EXISTS expenses_sources (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          sub_source_id INTEGER REFERENCES expenses_sub_sources(id)
        );
      `);
      
    await client.query(`
        CREATE TABLE IF NOT EXISTS expense (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          source_id INTEGER REFERENCES expenses_sources(id),
          sub_source_id INTEGER REFERENCES expenses_sub_sources(id),
          name VARCHAR(255) NOT NULL,
          amount NUMERIC NOT NULL,
          date DATE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

    console.log('Tables have been created.');
  } catch (err) {
    console.error('Error creating tables', err);
  } finally {
    client.release();
  }
};

createTables();
