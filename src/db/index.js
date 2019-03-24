import makeKnex from 'knex';
import makeDebug from 'debug';
import fs from 'fs';
import { config as loadEnv } from 'dotenv';
const debug = makeDebug('brainfm:server/db/index');

loadEnv();

export const connect = () => {
  if (process.env.SERVER_ENV === 'production') {
    debug('DB: Production 🦁');
    return makeKnex({
      client: 'mysql',
      connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        ssl: {
          ca: fs.readFileSync('db/certs/live/server-ca.pem'),
          cert: fs.readFileSync('db/certs/live/client-cert.pem'),
          key: fs.readFileSync('db/certs/live/client-key.pem')
        }
      },
      pool: { min: 0, max: 100 }
    });
  }

  debug('DB: Local');
  return makeKnex({
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_HOST_LOCAL,
      user: process.env.MYSQL_USER_LOCAL,
      password: process.env.MYSQL_PASSWORD_LOCAL,
      database: process.env.MYSQL_DATABASE_LOCAL
    },
    pool: { min: 0, max: 100 }
  });
};

const DB = connect();

export default DB;
