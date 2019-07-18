const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('connected to psql db');
});

const migrate = (queryText) => {
  return new Promise((resolve, reject) => {
    pool.query(queryText)
      .then((res) => {
        resolve(res);
        pool.end();
      })
      .catch((e) => {
        pool.end();
        reject(e);
      });
  });
};
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
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )`;

  migrate(queryText);
};

/**
 * Drop users table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *';
  migrate(queryText);
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
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )`;

  migrate(queryText);
};

/**
 * Drop buses table
 */
const dropBusTable = () => {
  const queryText = 'DROP TABLE IF EXISTS buses returning *';
  migrate(queryText);
};

/**
 * Create enum type
 */
const createEnumType = () => {
  const queryText = `
  CREATE TYPE trip_status AS ENUM ('active', 'suspended', 'cancelled')
  `;

  migrate(queryText);
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
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        FOREIGN KEY (bus_id) REFERENCES buses (id) ON DELETE CASCADE
      )`;

  migrate(queryText);
};

/**
 * Drop trips table
 */
const dropTripTable = () => {
  const queryText = 'DROP TABLE IF EXISTS trips returning *';
  migrate(queryText);
};

/**
 * Create bookings table
 */
const createBookingTable = () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS
      bookings(
        id SERIAL NOT NULL,
        trip_id INT NOT NULL,
        user_id INT NOT NULL,
        seat_number INT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        PRIMARY KEY (trip_id, user_id),
        UNIQUE (trip_id, seat_number),
        FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )`;

  migrate(queryText);
};

/**
 * Drop bookings table
 */
const dropBookingTable = () => {
  const queryText = 'DROP TABLE IF EXISTS bookings returning *';
  migrate(queryText);
};

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUserTable();
  createBusTable();
  createEnumType();
  createTripTable();
  createBookingTable();
};
/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropBookingTable();
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
  createBookingTable,
  createAllTables,
  dropBookingTable,
  dropTripTable,
  dropBusTable,
  dropUserTable,
  dropAllTables,
};

// eslint-disable-next-line import/no-extraneous-dependencies
require('make-runnable');
