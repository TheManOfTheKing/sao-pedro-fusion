import mysql from 'mysql2/promise';
const url = 'mysql://root:UQJIuvreeAmZnSFUJODxhgEPeeDiLKIW@switchback.proxy.rlwy.net:31151/railway';
const main = async () => {
  const conn = await mysql.createConnection(url);
  const [rows] = await conn.query("SELECT id, email, passwordHash, LENGTH(passwordHash) as len FROM users WHERE email = 'delmondesadv@gmail.com'");
  console.log(rows);
  await conn.end();
};
main().catch(err => { console.error(err); process.exit(1); });
