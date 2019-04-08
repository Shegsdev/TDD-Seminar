import { Pool } from 'pg';

require('dotenv').config();

let DATABASE_URL;

if (process.env.NODE_ENV === 'TEST') {
  DATABASE_URL = 'postgres://yfcpxsfk:76dAtofVjZk9lWBDaTt-ou_C2Ks6xLYA@manny.db.elephantsql.com:5432/yfcpxsfk';
} else {
  // eslint-disable-next-line prefer-destructuring
  DATABASE_URL = 'postgres://yfcpxsfk:76dAtofVjZk9lWBDaTt-ou_C2Ks6xLYA@manny.db.elephantsql.com:5432/yfcpxsfk';
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('connected to the db');
});


// pool.on('remove', () => {
//   // eslint-disable-next-line no-console
//   console.log('client removed');
//   process.exit(0);
// });

export default pool;
