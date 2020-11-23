'use strict';

const S3 = require('aws-sdk/clients/s3');
const csv = require('csv-parser');

const BUCKET = 'lesson-5-uploaded';
const PREFIX = 'uploaded/';
const REGION = 'eu-west-1';

module.exports.importProductsFile = async event => {

    const s3 = new S3({ region: REGION });

    let statusCode = 200;
    let body;

    const params = {
        Bucket: BUCKET,
        Key: PREFIX + event.queryStringParameters.name,
        Expires: 60,
        ContentType: 'text/csv'
    };

    try {
        body = await s3.getSignedUrlPromise('putObject', params);

    } catch (e) {
        body = e;
        statusCode = 500;
    }

    return {
        statusCode,
        body
    };
};

module.exports.importFileParser = async event => {
    let statusCode = 200;
    let body = null;

    const key = event.Records[0].s3.object.key;

    console.log('!!! event: ' + JSON.stringify(event));

    const s3 = new S3({ region: REGION });

    const params = {
        Bucket: BUCKET,
        Key: key
    };

    try {
        const readStream = await s3.getObject(params).createReadStream();

        const blocker = new Promise((res, rej) => {
            readStream
                .pipe(csv({ separator: '\t' }))
                .on('data', data => console.log('DATA: ' + JSON.stringify(data)))
                .on('error', error => {
                    console.log('Error during file reading: ' + error);
                    rej();
                })
                .on('end', () => {
                    res();
                });
        });

        await blocker;

        await s3.copyObject({
            Bucket: BUCKET,
            CopySource: BUCKET + '/' + key,
            Key: key.replace('uploaded', 'parsed')
        }).promise();

        await s3.deleteObject({
            Bucket: BUCKET,
            Key: key
        }).promise();

    } catch (e) {
        body = e;
        statusCode = 500;
    }

    return {
        statusCode,
        body
    };
};
