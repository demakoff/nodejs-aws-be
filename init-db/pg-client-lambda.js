'use strict';
const { Client } = require('pg');

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

module.exports.initDB = async event => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const dropResult = await client.query(`DROP TABLE products, stock;`);
        console.log('dropResult: ' + JSON.stringify(dropResult.rows));

        //make ddl query for creation table
        const ddlResult = await client.query(`
            create table if not exists products (
                id serial primary key,
                title text,
                year smallint,
                engine text,
                price integer,
                image_url text
            )`);
        console.log('ddlResult: ' + JSON.stringify(ddlResult.rows));
        const ddlResult2 = await client.query(`  
            create table if not exists stock (
                id serial primary key,
                product_id integer,
                count smallint,
                foreign key (product_id) references products (id)
            )`);
        console.log('ddlResult2: ' + JSON.stringify(ddlResult2.rows));


        // make initial dml queries
        const dmlResult = await client.query(`
            insert into products (title, year, engine, price, image_url) values
                ('Nissan X-Trail', 2019, '2.5 Gas', 24000, 'https://www-europe.nissan-cdn.net/content/dam/Nissan/nissan_europe/Configurator/Xtrail/p32r/grade/17TDIEULHD_X-TRAIL_VISIA_AMBER_001_UA.jpg.ximg.l_3_m.smart.jpg'),
                ('Toyota RAV4', 2012, '2.0 Gas hybrid', 18000, 'https://www.motortrend.com/uploads/sites/10/2015/11/2012-toyota-rav4-sport-suv-angular-front.png'),
                ('Mitsubishi Outlander', 2019, '2.0 Diesel', 25000, 'https://diag38.ru/wp-content/uploads/mitsubishi-outlander-2019-tehnicheskie-harakteristiki_2.jpg'),
                ('Honda CR-V', 2015, '2.2 Gas', 22000, 'https://s.pn.com.ua/i/md/3011/honda_cr_v_2015/honda_cr_v_2015_00p.jpg')
`);
        const dmlResult2 = await client.query(`
            insert into stock (product_id, count) values
                (1, 4),
                (2, 6),
                (3, 7),
                (4, 12)`
        );
        console.log('dmlResult: ' + JSON.stringify(dmlResult.rows));
        console.log('dmlResult2: ' + JSON.stringify(dmlResult2.rows));

        // make select query
        const { rows: products } = await client.query(`select * from products`);
        console.log('ALL: ' + JSON.stringify(products));

    } catch (err) {
        // you can process error here. In this example just log it to console.
        console.error('Error during database request executing:', err);
    } finally {
        // in case if error was occurred, connection will not close automatically
        client.end(); // manual closing of connection
    }

};
