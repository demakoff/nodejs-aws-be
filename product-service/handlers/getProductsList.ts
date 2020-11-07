import {APIGatewayProxyHandler} from 'aws-lambda';
import { getProductListFromDB } from './db/getProductsListFromDB';

export const getProductsList: APIGatewayProxyHandler = async () => {

    try {
        const ProductsList = await getProductListFromDB();

        if (!ProductsList || !ProductsList.length) {
            throw new Error('Products not found');
        }

        return {
            statusCode: 200,
            body: JSON.stringify(ProductsList),
        };

    } catch(err) {
        return {
            statusCode: 404,
            body: err.message
        };
    }
};
