import { APIGatewayProxyHandler } from 'aws-lambda';

import { CustomError } from './utils/CustomError';
import { getProductByIdFromDB } from './db/getProductByIdFromDB';

export const getProductsById: APIGatewayProxyHandler = async (event) => {

    try {
        const { id } = event.pathParameters || {};

        // if (!/^[0-9a-f]{12}$/.test(id)) {
        if (!/^\d{1,10}$/.test(id)) {
            throw new CustomError({
                message: 'Invalid ID supplied',
                code: 400
            });
        }

        const product = (await getProductByIdFromDB(id))[0];

        if (!product) {
            throw new CustomError({
                message: 'Product not found',
                code: 404
            });
        }

        return {
            statusCode: 200,
            body: JSON.stringify(product)
        };

    } catch(err) {
        return {
            statusCode: err.code,
            body: err.message
        };
    }
};


