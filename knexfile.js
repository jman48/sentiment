const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  local: {
    client: "mysql",
    connection: {
      host: process.env.MYSQL_HOST_LOCAL,
      user: process.env.MYSQL_USER_LOCAL,
      password: process.env.MYSQL_PASSWORD_LOCAL,
      database: process.env.MYSQL_DATABASE_LOCAL
    },
    pool: { min: 0, max: 100 }
  },
  production: {
    client: "mysql",
    connection: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    },
    pool: { min: 0, max: 100 }
  }
};
