import sqlite3 from 'sqlite3';
import { verifyPassword, hashPassword } from "./encrypt"
const db = new sqlite3.Database('src/db/mydatabase.db');
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(16),
    password VARCHAR(50),
    birthday DATE,
    created_at DATETIME,
    last_modified DATETIME
  );
`;

db.run(createTableSQL);

const createIndexSQL = `
  CREATE INDEX IF NOT EXISTS idx_account_email ON Account (email);
`;

// Run the SQL commands to create the table and index
db.serialize(() => {
    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('Error creating the table:', err.message);
        } else {
            console.log('Table "Account" created successfully.');
        }
    });

    db.run(createIndexSQL, (err) => {
        if (err) {
            console.error('Error creating the index:', err.message);
        } else {
            console.log('Index "idx_account_email" created successfully.');
        }
    });
});


function getAccounts() {
    return new Promise((resolve, reject) => {

        db.all("SELECT * FROM users", (err: any, rows: any) => {
            if (err) {
                console.error(err);
                reject(err)
            }
            resolve(rows)

        });
    })
}



async function createAccount(accountData: any) {
    const query = `
      INSERT INTO users (first_name, last_name, email, phone, password, birthday, created_at, last_modified)
      VALUES (?, ?,?, ?,?, ?,?, ?)
    `;

    console.log(accountData)


    const { first_name, last_name, email, phone, password, birthday } = accountData
    const hashedPassword = await hashPassword(password)
    return new Promise((resolve, reject) => {
        db.run(
            query,
            [first_name, last_name, email, phone, hashedPassword, birthday, Date(), Date()],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    // Return the ID of the newly inserted row
                    resolve(this);
                }
            }
        );
    });
}
function checkUserExists(username: string) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.get(query, [username], (err, row) => {
            if (err || !row) {
                reject(err);
            }
            const userExists = !!row;
            resolve(row);
        });
    })

}

function update(args: any) {
    const query = `
    UPDATE users
    SET
      first_name = ?,
      last_name = ?,
      phone = ?,
      birthday = ?,
      last_modified = datetime('now', 'localtime')
    WHERE id = ?
  `;
    return new Promise((resolve, reject) => {
        db.run(
            query,
            [args.first_name, args.last_name, args.phone, args.birthday, args.id],
            (err) => {
                if (err) {
                    reject(false)
                }
                resolve(true)
            }
        );
    })

}

function deleteuser(id: any) {
    const query = 'DELETE FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
        db.run(query, [id], (err) => {
            if (err) {
                reject(false)
            }
            resolve(true)
        });
    })



}


export { getAccounts, createAccount, checkUserExists, update, deleteuser }