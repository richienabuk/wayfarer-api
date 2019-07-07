import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USERNAME || 'postgres',
  database: process.env.DATABASE || 'wayfarer',
  password: process.env.DB_PASSWORD || 'enthusiast',
  port: process.env.DB_PORT || 5432,
  max: process.env.DB_MAX || 10, // max number of clients in the pool
  idleTimeoutMillis: process.env.DB_TIMEOUT || 30000,
};

export default config;
