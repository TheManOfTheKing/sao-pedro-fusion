import mysql from 'mysql2/promise';
const url = 'mysql://root:UQJIuvreeAmZnSFUJODxhgEPeeDiLKIW@switchback.proxy.rlwy.net:31151/railway';
const hash = '$2a$12$F/k1zGclQvmD54lHsf15HeA.nhy16qvQLkId70fuJ5TfGyJP9g9hG';
const main = async () => {
  const conn = await mysql.createConnection(url);
  await conn.query(`UPDATE users SET passwordHash = ? WHERE email = 'delmondesadv@gmail.com'`, [hash]);
  const [rows] = await conn.query("SELECT passwordHash, LENGTH(passwordHash) as len FROM users WHERE email = 'delmondesadv@gmail.com'");
  console.log(rows);
  await conn.end();
};
main().catch(err => { console.error(err); process.exit(1); });
