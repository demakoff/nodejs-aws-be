import {APIGatewayProxyHandler} from 'aws-lambda';
import { getProductListFromDB } from './db/getProductsListFromDB';
import { CustomError } from "./utils/CustomError";

export const getProductsList: APIGatewayProxyHandler = async (event) => {

    console.log(JSON.stringify(event));

    try {
        const ProductsList = await getProductListFromDB();

        if (!ProductsList || !ProductsList.length) {
            throw new CustomError({
                message: 'Products not found',
                code: 404
            });
        }

        return {
            statusCode: 200,
            body: JSON.stringify(ProductsList),
        };

    } catch(err) {
        return {
            statusCode: err.code,
            body: err.message
        };
    }
};
