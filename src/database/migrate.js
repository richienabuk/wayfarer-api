const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('connected to psql db');
});

/**
 * Create users table
 */
const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL NOT NULL PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        first_name VARCHAR(80) NOT NULL,
        last_name VARCHAR(80) NOT NULL,
        password VARCHAR(128) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop users table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create buses table
 */
const createBusTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      buses(
        id SERIAL NOT NULL PRIMARY KEY,
        number_plate VARCHAR(128) UNIQUE NOT NULL,
        manufacturer VARCHAR(128) NOT NULL,
        model VARCHAR(128) NOT NULL,
        year VARCHAR(128) NOT NULL,
        capacity INT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop buses table
 */
const dropBusTable = () => {
  const queryText = 'DROP TABLE IF EXISTS buses returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create enum type
 */
const createEnumType = () => {
  const queryText = `
  CREATE TYPE trip_status AS ENUM ('active', 'suspended', 'cancelled')
  `;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create trips table
 */
const createTripTable = () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS
      trips(
        id SERIAL NOT NULL PRIMARY KEY,
        bus_id INT NOT NULL,
        origin VARCHAR(128) NOT NULL,
        destination VARCHAR(128) NOT NULL,
        trip_date DATE NOT NULL,
        status trip_status DEFAULT 'active',
        fare FLOAT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        FOREIGN KEY (bus_id) REFERENCES buses (id) ON DELETE CASCADE
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop trips table
 */
const dropTripTable = () => {
  const queryText = 'DROP TABLE IF EXISTS trips returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};
/**
 * Create All Tables
 */
const createAllTables = () => {
  createUserTable();
  createBusTable();
  createEnumType();
  createTripTable();
};
/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropTripTable();
  dropBusTable();
  dropUserTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createUserTable,
  createBusTable,
  createTripTable,
  createAllTables,
  dropTripTable,
  dropBusTable,
  dropUserTable,
  dropAllTables,
};

// eslint-disable-next-line import/no-extraneous-dependencies
require('make-runnable');
