module.exports.basicAuthorizer = async (event, ctx, cb) => {

    if (event.type !== 'TOKEN')
        cb('Unauthorized');
    try {
        const encodedToken = event.authorizationToken.split(' ')[1];
        const plainCreds = Buffer.from(encodedToken, 'base64').toString('utf-8');
        const [username = '', password = ''] = plainCreds.split(':');

        const ADMIN_PASSWORD = process.env[username];

        let effect = 'Deny';

        if( username && password && password === ADMIN_PASSWORD) {
            effect = 'Allow';
        }
        const policy = generatePolicy(encodedToken, event.methodArn, effect);

        cb(null, policy);

    } catch (e) {
        cb('Unauthorized ' + e.message);
    }

    function generatePolicy(principalId, resource, effect = 'Deny') {
        const authResponse = { principalId };

        if (effect && resource) {
            authResponse.policyDocument = {
                Version: '2012-10-17',
                Statement: [ {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                } ]
            };
        }

        return authResponse;
    }
};
