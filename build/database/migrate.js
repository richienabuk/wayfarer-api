"use strict";

var _require = require('pg'),
    Pool = _require.Pool;

var dotenv = require('dotenv');

dotenv.config();
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
pool.on('connect', function () {
  console.log('connected to psql db');
});
/**
 * Create users table
 */

var createUserTable = function createUserTable() {
  var queryText = "CREATE TABLE IF NOT EXISTS\n      users(\n        id SERIAL NOT NULL PRIMARY KEY,\n        email VARCHAR(128) UNIQUE NOT NULL,\n        first_name VARCHAR(80) NOT NULL,\n        last_name VARCHAR(80) NOT NULL,\n        password VARCHAR(128) NOT NULL,\n        is_admin BOOLEAN DEFAULT FALSE,\n        created_at TIMESTAMP NOT NULL,\n        updated_at TIMESTAMP NOT NULL\n      )";
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};
/**
 * Drop users table
 */


var dropUserTable = function dropUserTable() {
  var queryText = 'DROP TABLE IF EXISTS users returning *';
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};
/**
 * Create buses table
 */


var createBusTable = function createBusTable() {
  var queryText = "CREATE TABLE IF NOT EXISTS\n      buses(\n        id SERIAL NOT NULL PRIMARY KEY,\n        number_plate VARCHAR(128) UNIQUE NOT NULL,\n        manufacturer VARCHAR(128) NOT NULL,\n        model VARCHAR(128) NOT NULL,\n        year VARCHAR(128) NOT NULL,\n        capacity INT NOT NULL,\n        created_at TIMESTAMP NOT NULL,\n        updated_at TIMESTAMP NOT NULL\n      )";
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};
/**
 * Drop buses table
 */


var dropBusTable = function dropBusTable() {
  var queryText = 'DROP TABLE IF EXISTS buses returning *';
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};
/**
 * Create enum type
 */


var createEnumType = function createEnumType() {
  var queryText = "\n  CREATE TYPE trip_status AS ENUM ('active', 'suspended', 'cancelled')\n  ";
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};
/**
 * Create trips table
 */


var createTripTable = function createTripTable() {
  var queryText = "\n    CREATE TABLE IF NOT EXISTS\n      trips(\n        id SERIAL NOT NULL PRIMARY KEY,\n        bus_id INT NOT NULL,\n        origin VARCHAR(128) NOT NULL,\n        destination VARCHAR(128) NOT NULL,\n        trip_date DATE NOT NULL,\n        status trip_status DEFAULT 'active',\n        fare FLOAT NOT NULL,\n        created_at TIMESTAMP NOT NULL,\n        updated_at TIMESTAMP NOT NULL,\n        FOREIGN KEY (bus_id) REFERENCES buses (id) ON DELETE CASCADE\n      )";
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};
/**
 * Drop trips table
 */


var dropTripTable = function dropTripTable() {
  var queryText = 'DROP TABLE IF EXISTS trips returning *';
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};
/**
 * Create bookings table
 */


var createBookingTable = function createBookingTable() {
  var queryText = "\n    CREATE TABLE IF NOT EXISTS\n      bookings(\n        id SERIAL NOT NULL,\n        trip_id INT NOT NULL,\n        user_id INT NOT NULL,\n        seat_number INT NOT NULL,\n        created_at TIMESTAMP NOT NULL,\n        updated_at TIMESTAMP NOT NULL,\n        PRIMARY KEY (trip_id, user_id),\n        UNIQUE (trip_id, seat_number),\n        FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,\n        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE\n      )";
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};
/**
 * Drop bookings table
 */


var dropBookingTable = function dropBookingTable() {
  var queryText = 'DROP TABLE IF EXISTS bookings returning *';
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  })["catch"](function (err) {
    console.log(err);
    pool.end();
  });
};
/**
 * Create All Tables
 */


var createAllTables = function createAllTables() {
  createUserTable();
  createBusTable();
  createEnumType();
  createTripTable();
  createBookingTable();
};
/**
 * Drop All Tables
 */


var dropAllTables = function dropAllTables() {
  dropBookingTable();
  dropTripTable();
  dropBusTable();
  dropUserTable();
};

pool.on('remove', function () {
  console.log('client removed');
  process.exit(0);
});
module.exports = {
  createUserTable: createUserTable,
  createBusTable: createBusTable,
  createTripTable: createTripTable,
  createBookingTable: createBookingTable,
  createAllTables: createAllTables,
  dropBookingTable: dropBookingTable,
  dropTripTable: dropTripTable,
  dropBusTable: dropBusTable,
  dropUserTable: dropUserTable,
  dropAllTables: dropAllTables
}; // eslint-disable-next-line import/no-extraneous-dependencies

require('make-runnable');
//# sourceMappingURL=migrate.js.map