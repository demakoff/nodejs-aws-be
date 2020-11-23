import { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
    service: {
        name: 'product-service',
    },
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true
        }
    },
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        stage: 'dev',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            PG_HOST: 'lesson4.cmlihsvlmgnc.eu-west-1.rds.amazonaws.com',
            PG_PORT: 5432,
            PG_DATABASE: 'lesson4',
            PG_USERNAME: 'postgres',
            PG_PASSWORD: 'badwty0GtiKWQgDG65vS'
        },
    },
    functions: {
        getProductsList: {
            handler: 'handlers/getProductsList.getProductsList',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'products',
                    }
                }
            ]
        },
        getProductsById: {
            handler: 'handlers/getProductsById.getProductsById',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'products/{id}',
                    }
                }
            ]
        },
        addProduct: {
            handler: 'handlers/addProduct.addProduct',
            events: [
                {
                    http: {
                        method: 'post',
                        path: 'products',
                    }
                }
            ]
        }
    }
};

module.exports = serverlessConfiguration;
