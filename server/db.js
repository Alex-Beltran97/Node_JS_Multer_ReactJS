import { createPool } from'mysql2';

export const pool = createPool({
  host:"localhost",
  port:3306,
  user:'root',
  password:'Alex091097*',
  database:'images_db'
}).promise();