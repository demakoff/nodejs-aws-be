const AWS = require('aws-sdk');
const csv = require('csv-parser');

const BUCKET = 'lesson-5-uploaded';
const REGION = 'eu-west-1';
const PREFIX = 'uploaded';

module.exports.importFileParser = async event => {
    let statusCode = 200;
    let body = null;

    const key = event.Records[0].s3.object.key;

    console.log('!!! event: ' + JSON.stringify(event));

    const s3 = new AWS.S3({ region: REGION });

    const params = {
        Bucket: BUCKET,
        Key: key
    };

    try {
        const readStream = await s3.getObject(params).createReadStream();

        const blocker = new Promise((res, rej) => {
            readStream
                .pipe(csv({ separator: '\t' }))
                .on('data', data => {
                    console.log('DATA: ' + JSON.stringify(data));

                    const sqs = new AWS.SQS();

                    sqs.sendMessage({
                        QueueUrl: process.env.SQS_URL,
                        MessageBody: JSON.stringify(data)
                    }, (err, data) => {
                        if (err) {
                            console.log("Error", err);
                        } else {
                            console.log("Success", data.MessageId);
                        }
                    })
                })
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
            Key: key.replace(PREFIX, 'parsed')
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
