const AWS = require('aws-sdk');
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

module.exports.catalogBatchProcess = async event => {
    let statusCode = 200;
    let body = null;
    let productBrief = '';

    const client = new Client(dbOptions);
    await client.connect();

    const productsQuery = event.Records.reduce( (mem, { body: rawProd }) => {
        const product = JSON.parse(rawProd);
        console.log('Product: ', product);
        productBrief += `${product.title} ${product.engine} ${product.year} with $${product.price} price\n`;

        return `
            ${mem}
            WITH new_product AS (
              INSERT INTO products (title, year, engine, price, image_url) VALUES
                ('${product.title}', ${product.year}, '${product.engine}', ${product.price}, '${product.image_url}')
              RETURNING id
            )
            
            INSERT INTO stock (product_id, count) VALUES 
            ((SELECT id FROM new_product), ${product.count});
        `;
    }, '');

    try {
        await client.query(productsQuery);
    } catch (err) {
        // you can process error here. In this example just log it to console.
        console.error('Error during database request executing:', err);
    } finally {
        // in case if error was occurred, connection will not close automatically
        client.end(); // manual closing of connection
    }

    const publishParams = {
        Subject: 'New products added',
        Message: productBrief, /* required */
        TopicArn: process.env.SNS_Topic
    };

    const sns = new AWS.SNS();

    await sns.publish(publishParams, function(err, data) {

        if (err) console.log(err, err.stack);
        else {
            console.log(`Message ${publishParams.Message} sent to the topic ${publishParams.TopicArn}`);
            console.log("MessageID is " + data.MessageId);
        }
    });

    return {
        statusCode,
        body
    };
};
