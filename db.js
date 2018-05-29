const { Pool } = require('pg');

const pool = new Pool();

pool.on('error', err => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('PG BAGLANDI');
});

const query = async (stringQuery, parameters) => {
  const client = await pool.connect();
  let res;
  try {
    res = await client.query(stringQuery, parameters);
  } catch (err) {
    throw new Error(err.message);
  } finally {
    client.release();
  }
  return res;
};

const queryArray = async (stringQuery, params) => {
  const client = await pool.connect();
  let res;
  try {
    res = await client.query({
      rowMode: 'array',
      text: stringQuery,
    });
  } catch (err) {
    throw new Error(err.message);
  } finally {
    client.release();
  }
  return res;
};

const queryP = async (stringQuery, parameters) => {
  const connect = await pool.connect();
  connect
    .then(client => {
      const res = client.query(stringQuery, parameters);
      return {
        client,
        res,
      };
    })
    .then(({ client }) => {
      client.release();
    })
    .catch(reason => {
      throw new Error(`ERROR: ${reason}`);
    });
};

const transactionQuery = async callback => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    try {
      await callback();
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw new Error(err.message);
    }
  } finally {
    client.release();
  }
};

const insertQueryBuilder = async ({ tableName, cols }) => {
  const raw = [`INSERT INTO ${tableName} (`];
  const inserts = [];
  const values = [];

  Object.keys(cols).forEach(key => {
    inserts.push(`${key}`);
  });
  raw.push(inserts.join(', '));
  raw.push(') VALUES (');
  Object.keys(cols).forEach((key, i) => {
    values.push(`$${i + 1}`);
  });
  raw.push(values.join(', '));
  raw.push(') RETURNING *');

  const sqlQuery = raw.join(' ');
  try {
    const rows = await query(sqlQuery, Object.values(cols));
    return rows;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateQueryBuilder = async ({ tableName, cols, whereCol, equalsVal }) => {
  const raw = [`UPDATE ${tableName} SET`];
  const set = [];

  Object.keys(cols).forEach((key, i) => {
    set.push(`${key}=$${i + 1}`);
  });
  raw.push(set.join(', '));
  raw.push(`WHERE ${whereCol} = '${equalsVal}' RETURNING *`);
  const sqlQuery = raw.join(' ');

  try {
    const rows = await query(sqlQuery, Object.values(cols));
    return rows;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  pool,
  query,
  queryArray,
  queryP,
  transactionQuery,
  insertQueryBuilder,
  updateQueryBuilder,
};
