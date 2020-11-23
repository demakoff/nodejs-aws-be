import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // to avoid warring in this example
    },
    connectionTimeoutMillis: 5000 // time in millisecond for termination of the database query
};

export async function runQuery<T>(query: string): Promise<T> {

    const client = new Client(dbOptions);
    await client.connect();

    let result;
    try {
        // make select query
        result = (await client.query(query)).rows as T;

    } catch (err) {
        // you can process error here. In this example just log it to console.
        console.error('Error during database request executing:', err);
        throw err;
    } finally {
        // in case if error was occurred, connection will not close automatically
        client.end(); // manual closing of connection
    }

    return result;
}
