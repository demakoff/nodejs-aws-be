import {APIGatewayProxyHandler} from "aws-lambda";

import ProductsListMock from './productsList.mock.json';
import { Product } from "./models/Product";

export const getProductsList: APIGatewayProxyHandler = async () => {

    try {

        const ProductsList = await getProductListFromDB();

        if (!ProductsList || !ProductsList.length) {
            throw new Error('Products not found');
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify(ProductsList),
            };
        }

    } catch(err) {
        return {
            statusCode: 404,
            body: err.message
        };
    }
};

function getProductListFromDB(): Product[] {
    return ProductsListMock;
}
