const AWS = require('aws-sdk');

const BUCKET = 'lesson-5-uploaded';
const PREFIX = 'uploaded/';
const REGION = 'eu-west-1';

module.exports.importProductsFile = async event => {

    const s3 = new AWS.S3({ region: REGION, signatureVersion: "v4" });

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
