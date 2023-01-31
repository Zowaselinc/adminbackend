
const {MySQL2Extended} = require ('mysql2-extended');
const {createPool} =  require ('mysql2/promise');

const pool = createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

const mydb = new MySQL2Extended(pool);

module.exports={mydb}