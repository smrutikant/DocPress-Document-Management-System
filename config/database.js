require('dotenv').config();

module.exports = {
  postgres: {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    database: process.env.PG_DATABASE || 'docpress',
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || 'password'
  },
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/docpress'
  }
};
